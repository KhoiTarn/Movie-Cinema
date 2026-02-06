const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/ReviewController');

const { authMiddleware } = require('../middlewares/auth.middleware');

// Create or update a review
router.post('/', authMiddleware, ReviewController.createOrUpdateReview);

// Get reviews for a movie
router.get('/movie/:movie_id', ReviewController.getMovieReviews);

module.exports = router;
