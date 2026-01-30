const express = require("express");
const BookingController = require("../controllers/BookingController");
const { authMiddleware } = require("../middlewares/auth.middleware");
const router = express.Router();

// Apply middleware to all routes
router.use(authMiddleware);

router.post("/", BookingController.createBooking);
router.get("/my-bookings", BookingController.getMyBookings);

module.exports = router;
