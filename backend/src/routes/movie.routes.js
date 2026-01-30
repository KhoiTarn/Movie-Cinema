const express = require("express");
const MovieController = require("../controllers/MovieController");
const router = express.Router();

router.get("/", MovieController.getAll);
router.get("/:id", MovieController.getOne);

module.exports = router;
