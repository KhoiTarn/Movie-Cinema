const express = require("express");
const movieRoutes = require("./movie.routes");
const cinemaRoutes = require("./cinema.routes");
const authRoutes = require("./auth.routes");
const showtimeRoutes = require("./showtime.routes");
const bookingRoutes = require("./booking.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/movies", movieRoutes);
router.use("/cinemas", cinemaRoutes);
router.use("/showtimes", showtimeRoutes);
router.use("/bookings", bookingRoutes);

module.exports = router;
