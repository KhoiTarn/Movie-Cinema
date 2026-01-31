const { AppDataSource } = require("../data-source");
const { Between } = require("typeorm"); // Simplified filter

const showtimeRepository = AppDataSource.getRepository("Showtime");
const seatRepository = AppDataSource.getRepository("Seat");
const reservationRepository = AppDataSource.getRepository("SeatReservation");

class ShowtimeController {

    // GET /api/showtimes?movie_id=1&date=2026-02-01
    static async getAll(req, res) {
        try {
            const { movie_id, date } = req.query;
            const where = {};

            if (movie_id) where.movie = { movie_id: parseInt(movie_id) };

            // Note: Date filtering in TypeORM can be complex with timezones. 
            // For now, return all or filter by movie only for simplicity.

            const showtimes = await showtimeRepository.find({
                where: where,
                relations: ["movie", "room", "room.cinema"],
                order: { start_time: "ASC" }
            });

            res.json(showtimes);
        } catch (error) {
            console.error("Get Showtimes Error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // GET /api/showtimes/:id
    static async getOne(req, res) {
        try {
            const id = parseInt(req.params.id);
            const showtime = await showtimeRepository.findOne({
                where: { showtime_id: id },
                relations: ["movie", "room", "room.cinema"]
            });
            if (!showtime) return res.status(404).json({ message: "Showtime not found" });
            res.json(showtime);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // GET /api/showtimes/:id/seats
    static async getSeats(req, res) {
        try {
            const showtimeId = parseInt(req.params.id);

            // 1. Get Showtime to know the Room
            const showtime = await showtimeRepository.findOne({
                where: { showtime_id: showtimeId },
                relations: ["room"]
            });
            if (!showtime) return res.status(404).json({ message: "Showtime not found" });

            // 2. Get all Seats for this Room
            const seats = await seatRepository.find({
                where: { room: { room_id: showtime.room.room_id } },
                order: { row_index: "ASC", column_index: "ASC" }
            });

            // 3. Get all Reservations for this Showtime
            const reservations = await reservationRepository.find({
                where: { showtime: { showtime_id: showtimeId } },
                relations: ["seat"]
            });

            const reservedMap = {};
            reservations.forEach(r => {
                if (r.status === 'CONFIRMED' || r.status === 'HOLD') {
                    if (r.seat) {
                        reservedMap[r.seat.seat_id] = r.status;
                    }
                }
            });

            // 5. Build response
            const seatMap = seats.map(seat => ({
                ...seat,
                status: reservedMap[seat.seat_id] ? 'BOOKED' : 'AVAILABLE' // Simplify status for frontend
            }));

            res.json(seatMap);

        } catch (error) {
            console.error("Get Seats Error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    // POST /api/showtimes
    static async create(req, res) {
        try {
            const { movie_id, room_id, start_time, base_price } = req.body;

            const movie = await AppDataSource.getRepository("Movie").findOne({ where: { movie_id } });
            if (!movie) return res.status(404).json({ message: "Movie not found" });

            const room = await AppDataSource.getRepository("Room").findOne({ where: { room_id } });
            if (!room) return res.status(404).json({ message: "Room not found" });

            const startTimeDate = new Date(start_time);
            const duration = movie.duration_minutes || 120; // Default 120 mins if null
            const endTimeDate = new Date(startTimeDate.getTime() + duration * 60000);

            const showtime = showtimeRepository.create({
                movie,
                room,
                start_time: startTimeDate,
                end_time: endTimeDate,
                base_price
            });

            await showtimeRepository.save(showtime);
            res.status(201).json({ message: "Showtime created successfully", showtime });

        } catch (error) {
            console.error("Create Showtime Error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }

    // DELETE /api/showtimes/:id
    static async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            const showtime = await showtimeRepository.findOne({ where: { showtime_id: id } });

            if (!showtime) return res.status(404).json({ message: "Showtime not found" });

            await showtimeRepository.remove(showtime);
            res.json({ message: "Showtime deleted successfully" });
        } catch (error) {
            console.error("Delete Showtime Error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
}

module.exports = ShowtimeController;
