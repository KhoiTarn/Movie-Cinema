const { AppDataSource } = require("../data-source");

const bookingRepository = AppDataSource.getRepository("Booking");
const showtimeRepository = AppDataSource.getRepository("Showtime");
const seatRepository = AppDataSource.getRepository("Seat");
const reservationRepository = AppDataSource.getRepository("SeatReservation");

class BookingController {

    // POST /api/bookings
    static async createBooking(req, res) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const { showtime_id, seat_ids } = req.body;
            const userId = req.user.user_id; // From authMiddleware

            if (!seat_ids || seat_ids.length === 0) {
                return res.status(400).json({ message: "No seats selected" });
            }

            // 1. Get Showtime info
            const showtime = await showtimeRepository.findOne({ where: { showtime_id } });
            if (!showtime) throw new Error("Showtime not found");

            // 2. Calculate Total Amount & Validate Seats
            let totalAmount = 0;
            const seatsToBook = [];

            for (const seatId of seat_ids) {
                const seat = await seatRepository.findOne({ where: { seat_id: seatId } });
                if (!seat) throw new Error(`Seat ${seatId} not found`);

                // Check if already reserved
                const existingReservation = await reservationRepository.findOne({
                    where: {
                        showtime: { showtime_id },
                        seat: { seat_id: seatId },
                        status: "CONFIRMED" // Simplified check
                    }
                });

                if (existingReservation) {
                    throw new Error(`Seat ${seat.seat_code} is already booked`);
                }

                // Price calculation: Base Price * Seat Multiplier
                const seatPrice = Number(showtime.base_price) * Number(seat.price_multiplier);
                totalAmount += seatPrice;
                seatsToBook.push({ seat, price: seatPrice });
            }

            // 3. Create Booking Record
            const booking = bookingRepository.create({
                user: { user_id: userId },
                showtime: { showtime_id },
                total_amount: totalAmount,
                final_amount: totalAmount, // Discount logic can be added later
                status: "CONFIRMED", // Auto confirm for now
            });

            const savedBooking = await queryRunner.manager.getRepository("Booking").save(booking);

            // 4. Create Seat Reservations
            for (const item of seatsToBook) {
                const reservation = reservationRepository.create({
                    showtime: { showtime_id },
                    booking: { booking_id: savedBooking.booking_id },
                    seat: { seat_id: item.seat.seat_id },
                    status: "CONFIRMED",
                    price_at_booking: item.price
                });
                await queryRunner.manager.getRepository("SeatReservation").save(reservation);
            }

            await queryRunner.commitTransaction();

            res.status(201).json({
                message: "Booking successful",
                booking: savedBooking
            });

        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error("Booking Error:", error);
            res.status(400).json({ message: error.message || "Booking failed" });
        } finally {
            await queryRunner.release();
        }
    }

    // GET /api/bookings/my-bookings
    static async getMyBookings(req, res) {
        try {
            const userId = req.user.user_id;
            const bookings = await bookingRepository.find({
                where: { user: { user_id: userId } },
                relations: ["showtime", "showtime.movie", "showtime.screen.cinema"],
                order: { created_at: "DESC" }
            });
            res.json(bookings);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = BookingController;
