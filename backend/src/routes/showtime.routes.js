const express = require("express");
const ShowtimeController = require("../controllers/ShowtimeController");
const { authMiddleware } = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const router = express.Router();

router.get("/", ShowtimeController.getAll);
router.get("/:id", ShowtimeController.getOne);
router.get("/:id/seats", ShowtimeController.getSeats);

// Admin Routes
router.post("/", authMiddleware, adminMiddleware, ShowtimeController.create);
router.delete("/:id", authMiddleware, adminMiddleware, ShowtimeController.delete);

module.exports = router;
