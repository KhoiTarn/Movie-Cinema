const express = require("express");
const ShowtimeController = require("../controllers/ShowtimeController");
const router = express.Router();

router.get("/", ShowtimeController.getAll);
router.get("/:id", ShowtimeController.getOne);
router.get("/:id/seats", ShowtimeController.getSeats);

module.exports = router;
