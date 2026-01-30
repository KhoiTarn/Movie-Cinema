const express = require("express");
const UserController = require("../controllers/UserController");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware); // Protect all user routes

router.get("/profile", UserController.getProfile);
router.put("/profile", UserController.updateProfile); // Update profile
router.get("/bookings", UserController.getBookings);

module.exports = router;
