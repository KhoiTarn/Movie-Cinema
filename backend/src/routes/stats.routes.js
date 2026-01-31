const express = require("express");
const StatsController = require("../controllers/StatsController");
const { authMiddleware } = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, StatsController.getStats);

module.exports = router;
