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
                relations: ["movie", "screen", "screen.cinema"],
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
                relations: ["movie", "screen", "screen.cinema"]
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

            // 1. Get Showtime to know the Screen
            const showtime = await showtimeRepository.findOne({
                where: { showtime_id: showtimeId },
                relations: ["screen"]
            });
            if (!showtime) return res.status(404).json({ message: "Showtime not found" });

            // 2. Get all Seats for this Screen
            const seats = await seatRepository.find({
                where: { screen: { screen_id: showtime.screen.screen_id } },
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
}

module.exports = ShowtimeController;
