const express = require("express");
const GenreController = require("../controllers/GenreController");
const router = express.Router();

router.get("/", GenreController.getAll);

module.exports = router;
