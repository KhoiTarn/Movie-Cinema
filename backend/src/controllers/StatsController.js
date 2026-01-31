const { AppDataSource } = require("../data-source");

class StatsController {

    static async getStats(req, res) {
        try {
            const movieRepository = AppDataSource.getRepository("Movie");
            const bookingRepository = AppDataSource.getRepository("Booking");
            const reservationRepository = AppDataSource.getRepository("SeatReservation");

            // 1. Total Movies
            const totalMovies = await movieRepository.count();

            // 2. Total Bookings
            const totalBookings = await bookingRepository.count();

            // 3. Total Revenue
            // Sum 'price_at_booking' from CONFIRMED reservations
            // Or sum from booking details if stored there. 
            // In our current schema, SeatReservation has `price_at_booking`.
            const { sum } = await reservationRepository
                .createQueryBuilder("reservation")
                .select("SUM(reservation.price_at_booking)", "sum")
                .where("reservation.status = :status", { status: "CONFIRMED" })
                .getRawOne();

            const totalRevenue = sum ? parseInt(sum) : 0;

            res.json({
                totalMovies,
                totalBookings,
                totalRevenue
            });

        } catch (error) {
            console.error("Get Stats Error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
}

module.exports = StatsController;
