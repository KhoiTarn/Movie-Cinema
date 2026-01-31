const { AppDataSource } = require("../data-source");
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const { sendEmail } = require("../services/EmailService");

const userRepository = AppDataSource.getRepository("User");
const bookingRepository = AppDataSource.getRepository("Booking");
const reservationRepository = AppDataSource.getRepository("SeatReservation");

class UserController {

    // GET /api/users/profile
    static async getProfile(req, res) {
        try {
            // req.user is set by authMiddleware
            const userId = req.user.user_id;
            const user = await userRepository.findOne({
                where: { user_id: userId },
                select: ["user_id", "email", "full_name", "role", "google_id", "is_verified", "avatar_url", "created_at"] // Exclude password
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json(user);
        } catch (error) {
            console.error("Get Profile Error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }

    // GET /api/users/bookings
    static async getBookings(req, res) {
        try {
            const userId = req.user.user_id;

            // 1. Get Bookings with Showtime info
            const bookings = await bookingRepository.find({
                where: { user: { user_id: userId } },
                relations: {
                    showtime: {
                        movie: true,
                        room: {
                            cinema: true
                        }
                    }
                },
                order: { created_at: "DESC" }
            });

            // 2. Fetch seats for each booking
            const result = [];
            for (const booking of bookings) {
                const reservations = await reservationRepository.find({
                    where: { booking: { booking_id: booking.booking_id } },
                    relations: ["seat"]
                });

                const seats = reservations.map(r => ({
                    seat_id: r.seat.seat_id,
                    seat_code: r.seat.seat_code,
                    seat_type: r.seat.seat_type,
                    price: r.price_at_booking
                }));

                result.push({
                    ...booking,
                    seats: seats,
                    // Flatten structure for easier frontend consumption if needed, or keep as is
                    movie_title: booking.showtime.movie.title,
                    cinema_name: booking.showtime.room.cinema.name,
                    room_name: booking.showtime.room.name,
                    show_date: booking.showtime.show_date,
                    start_time: booking.showtime.start_time
                });
            }

            res.json(result);

        } catch (error) {
            console.error("Get Bookings Error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }

    // PUT /api/users/profile
    static async updateProfile(req, res) {
        try {
            const userId = req.user.user_id;
            const { full_name, password, avatar_url, email } = req.body;

            const user = await userRepository.findOne({ where: { user_id: userId } });
            if (!user) return res.status(404).json({ message: "User not found" });

            // Update allowed fields
            if (full_name) user.full_name = full_name;
            if (avatar_url) user.avatar_url = avatar_url;

            // Handle Email Change
            if (email && email !== user.email) {
                const existingUser = await userRepository.findOne({ where: { email } });
                if (existingUser) {
                    return res.status(400).json({ message: "Email already in use" });
                }
                user.email = email;
                user.is_verified = false;

                // Generate OTP for new email verification
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
                user.otp_code = otp;
                user.otp_expires_at = expiresAt;

                // Send OTP to new email
                await sendEmail(email, "Verify Your New Email", `Your OTP code is: ${otp}`);
            }

            // If password provided, hash it
            if (password) {
                user.password = await bcrypt.hash(password, 10);
            }

            await userRepository.save(user);

            // Return updated info (exclude password)
            const { password: _, ...userInfo } = user;
            res.json({ message: "Profile updated successfully. If changed email, please verify.", user: userInfo });

        } catch (error) {
            console.error("Update Profile Error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
}

module.exports = UserController;
