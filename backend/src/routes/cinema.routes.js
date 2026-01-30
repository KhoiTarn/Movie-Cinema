const express = require("express");
const CinemaController = require("../controllers/CinemaController");
const router = express.Router();

router.get("/", CinemaController.getAll);

module.exports = router;
