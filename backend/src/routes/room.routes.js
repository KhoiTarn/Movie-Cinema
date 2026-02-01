const express = require("express");
const RoomController = require("../controllers/RoomController");
const { authMiddleware } = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, RoomController.getAll);
router.post("/", authMiddleware, adminMiddleware, RoomController.create);
router.put("/:id", authMiddleware, adminMiddleware, RoomController.update);
router.delete("/:id", authMiddleware, adminMiddleware, RoomController.delete);

router.post("/:id/layout", authMiddleware, adminMiddleware, RoomController.generateLayout);
router.get("/:id/seats", authMiddleware, adminMiddleware, RoomController.getSeats);
router.put("/seats/:seatId", authMiddleware, adminMiddleware, RoomController.updateSeat);

module.exports = router;
