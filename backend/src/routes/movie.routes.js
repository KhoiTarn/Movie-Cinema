const express = require("express");
const MovieController = require("../controllers/MovieController");
const router = express.Router();

const { authMiddleware } = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

// Public Routes
router.get('/', MovieController.getAll);
router.get('/:id', MovieController.getOne);

// Admin Routes
router.post('/', authMiddleware, adminMiddleware, MovieController.createMovie);
router.put('/:id', authMiddleware, adminMiddleware, MovieController.updateMovie);
router.delete('/:id', authMiddleware, adminMiddleware, MovieController.deleteMovie);

module.exports = router;
