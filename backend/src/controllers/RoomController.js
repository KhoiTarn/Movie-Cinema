const { AppDataSource } = require("../data-source");

const roomRepository = AppDataSource.getRepository("Room");
const seatRepository = AppDataSource.getRepository("Seat");
const cinemaRepository = AppDataSource.getRepository("Cinema");

class RoomController {

    // GET /api/rooms
    static async getAll(req, res) {
        try {
            const rooms = await roomRepository.find({
                relations: ["cinema"],
                order: { room_id: "ASC" }
            });
            res.json(rooms);
        } catch (error) {
            console.error("Get Rooms Error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }

    // POST /api/rooms
    static async create(req, res) {
        try {
            const { name, cinema_id, status } = req.body;

            // For simplicity, default to first cinema if not provided, or fetch specific
            const cinema = await cinemaRepository.findOne({ where: { cinema_id: cinema_id || 1 } });

            const room = roomRepository.create({
                name,
                cinema,
                status: status || 'AVAILABLE',
                seat_count: 0
            });

            await roomRepository.save(room);
            res.status(201).json(room);
        } catch (error) {
            console.error("Create Room Error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }

    // PUT /api/rooms/:id
    static async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { name, status } = req.body;

            const room = await roomRepository.findOne({ where: { room_id: id } });
            if (!room) return res.status(404).json({ message: "Room not found" });

            if (name) room.name = name;
            if (status) room.status = status;

            await roomRepository.save(room);
            res.json(room);
        } catch (error) {
            console.error("Update Room Error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }

    // DELETE /api/rooms/:id
    static async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            const room = await roomRepository.findOne({ where: { room_id: id } });
            if (!room) return res.status(404).json({ message: "Room not found" });

            // This cascades to seats usually, but verify DB FK constraints
            await roomRepository.remove(room);
            res.json({ message: "Room deleted" });
        } catch (error) {
            console.error("Delete Room Error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }

    // POST /api/rooms/:id/layout
    // Body: { rows: 10, cols: 10 }
    // POST /api/rooms/:id/layout
    // Body: { rows: 10, cols: 10 }
    static async generateLayout(req, res) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();

        // 1. Safety Check: Check for future showtimes before starting transaction
        // We do this outside transaction to avoid locking unnecessary rows if check fails
        try {
            const roomId = parseInt(req.params.id);
            const { rows, cols } = req.body;

            // Check for future showtimes
            const showtimeRepo = AppDataSource.getRepository("Showtime");
            const futureShowtimes = await showtimeRepo
                .createQueryBuilder("showtime")
                .where("showtime.room_id = :roomId", { roomId })
                .andWhere("showtime.end_time > :now", { now: new Date() })
                .getCount();

            if (futureShowtimes > 0) {
                return res.status(400).json({
                    message: "Không thể thay đổi sơ đồ phòng đang có suất chiếu trong tương lai. Vui lòng hủy suất chiếu trước."
                });
            }

            await queryRunner.startTransaction();

            console.log(`Generating layout for Room ${roomId}: ${rows}x${cols}`);

            const room = await queryRunner.manager.findOne("Room", { where: { room_id: roomId } });
            if (!room) {
                await queryRunner.rollbackTransaction();
                return res.status(404).json({ message: "Room not found" });
            }

            // 2. Delete existing seats
            await queryRunner.manager.createQueryBuilder()
                .delete()
                .from("Seat")
                .where("room_id = :roomId", { roomId })
                .execute();

            // 3. Prepare new seats data (Bulk Insert)
            const newSeats = [];

            // Helper function for smart seat code (A, B... Z, AA, AB...)
            const getRowLabel = (index) => {
                let label = "";
                while (index > 0) {
                    index--;
                    label = String.fromCharCode(65 + (index % 26)) + label;
                    index = Math.floor(index / 26);
                }
                return label;
            };

            for (let r = 1; r <= rows; r++) {
                const rowLabel = getRowLabel(r);
                for (let c = 1; c <= cols; c++) {
                    newSeats.push({
                        room: room, // TypeORM handles relation object in create, but towards raw insert we might need ID
                        // ensuring relation works with save, for bulk insert via QB we use relation differently or map ID
                        // utilizing .insert().values() is most performant
                        row_index: r,
                        column_index: c,
                        seat_code: `${rowLabel}${c}`,
                        seat_type: 'STANDARD',
                        status: 'AVAILABLE',
                        price_multiplier: 1.0,
                        room_id: roomId // Explicitly set FK for bulk insert
                    });
                }
            }

            // 4. Bulk Insert using QueryBuilder
            if (newSeats.length > 0) {
                await queryRunner.manager.createQueryBuilder()
                    .insert()
                    .into("Seat")
                    .values(newSeats.map(s => ({
                        row_index: s.row_index,
                        column_index: s.column_index,
                        seat_code: s.seat_code,
                        seat_type: s.seat_type,
                        status: s.status,
                        price_multiplier: s.price_multiplier,
                        room: { room_id: roomId } // Relation mapping
                    })))
                    .execute();
            }

            // 5. Update room seat count
            room.seat_count = newSeats.length;
            await queryRunner.manager.save("Room", room);

            await queryRunner.commitTransaction();
            console.log(`Generated ${newSeats.length} seats for Room ${roomId}`);

            res.json({ message: "Layout generated", seat_count: newSeats.length });

        } catch (error) {
            console.error("Generate Layout Error:", error);
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }

            // Check for Named Constraint Violation
            if (error.constraint === 'UQ_ROOM_ROW_COL') {
                return res.status(400).json({ message: "Dữ liệu ghế bị trùng lặp (Row/Col)." });
            }

            res.status(500).json({ message: "Server error", error: error.message });
        } finally {
            await queryRunner.release();
        }
    }

    // PUT /api/rooms/seats/:seatId
    // Body: { type: 'VIP' | 'STANDARD', status: 'AVAILABLE' | 'MAINTENANCE' }
    static async updateSeat(req, res) {
        try {
            const seatId = parseInt(req.params.seatId);
            const { type, status } = req.body;

            const seat = await seatRepository.findOne({ where: { seat_id: seatId } });
            if (!seat) return res.status(404).json({ message: "Seat not found" });

            if (type) {
                if (type === 'VIP') {
                    seat.seat_type = 'VIP';
                    seat.price_multiplier = 1.25;
                } else {
                    seat.seat_type = 'STANDARD';
                    seat.price_multiplier = 1.0;
                }
            }

            if (status) {
                seat.status = status;
            }

            await seatRepository.save(seat);
            res.json(seat);

        } catch (error) {
            console.error("Update Seat Error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }

    // GET /api/rooms/:id/seats
    static async getSeats(req, res) {
        try {
            const roomId = parseInt(req.params.id);
            const seats = await seatRepository.find({
                where: { room: { room_id: roomId } },
                order: { row_index: "ASC", column_index: "ASC" }
            });
            res.json(seats);
        } catch (error) {
            console.error("Get Room Seats Error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
}

module.exports = RoomController;
