const express = require("express");
const movieRoutes = require("./movie.routes");
const cinemaRoutes = require("./cinema.routes");
const authRoutes = require("./auth.routes");
const showtimeRoutes = require("./showtime.routes");
const bookingRoutes = require("./booking.routes");
const userRoutes = require("./user.routes");
const uploadRoutes = require("./upload.routes");
const genreRoutes = require("./genre.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/movies", movieRoutes);
router.use("/cinemas", cinemaRoutes);
router.use("/showtimes", showtimeRoutes);
router.use("/bookings", bookingRoutes);
router.use("/users", userRoutes);
router.use("/upload", uploadRoutes);
router.use("/genres", genreRoutes);
router.use("/stats", require("./stats.routes"));
router.use("/rooms", require("./room.routes"));

module.exports = router;
