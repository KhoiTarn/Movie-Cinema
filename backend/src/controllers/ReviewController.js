const { AppDataSource } = require("../data-source");

class ReviewController {
    static async createOrUpdateReview(req, res) {
        const { movie_id, rating, comment } = req.body;
        const user_id = req.user.user_id;

        if (!movie_id || !rating) {
            return res.status(400).json({ message: "Vui lòng cung cấp movie_id và rating (1-5)." });
        }

        const reviewRepo = AppDataSource.getRepository("Review");
        const movieRepo = AppDataSource.getRepository("Movie");
        const bookingRepo = AppDataSource.getRepository("Booking");

        try {
            // 1. Check if movie exists
            const movie = await movieRepo.findOneBy({ movie_id });
            if (!movie) {
                return res.status(404).json({ message: "Phim không tồn tại." });
            }

            // 1.1 Check if user has booked this movie
            const hasBooked = await bookingRepo.findOne({
                where: {
                    user: { user_id },
                    showtime: { movie: { movie_id } },
                    status: "CONFIRMED"
                },
                relations: ["showtime", "showtime.movie"]
            });

            if (!hasBooked) {
                return res.status(403).json({ message: "Bạn chỉ có thể đánh giá phim sau khi đã mua vé xem phim này." });
            }

            // 2. Check for existing review
            let review = await reviewRepo.findOne({
                where: { user: { user_id }, movie: { movie_id } }
            });

            if (review) {
                review.rating = rating;
                review.comment = comment;
            } else {
                review = reviewRepo.create({
                    user: { user_id },
                    movie: { movie_id },
                    rating,
                    comment
                });
            }

            await reviewRepo.save(review);

            // 3. Update Movie stats: rating_avg & review_count
            const reviews = await reviewRepo.find({ where: { movie: { movie_id } } });
            const reviewCount = reviews.length;
            const ratingAvg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount;

            await movieRepo.update(movie_id, {
                review_count: reviewCount,
                rating_avg: parseFloat(ratingAvg.toFixed(2))
            });

            res.status(200).json({ message: "Đã lưu đánh giá thành công!", review });
        } catch (error) {
            console.error("Review save error:", error);
            res.status(500).json({ message: "Lỗi hệ thống khi lưu đánh giá." });
        }
    }

    static async getMovieReviews(req, res) {
        const { movie_id } = req.params;
        const reviewRepo = AppDataSource.getRepository("Review");

        try {
            const reviews = await reviewRepo.find({
                where: { movie: { movie_id } },
                relations: ["user"],
                order: { created_at: "DESC" }
            });

            // Map to hide sensitive user data if needed
            const sanitizedReviews = reviews.map(r => ({
                review_id: r.review_id,
                rating: r.rating,
                comment: r.comment,
                created_at: r.created_at,
                user: {
                    full_name: r.user.full_name,
                    avatar_url: r.user.avatar_url
                }
            }));

            res.status(200).json(sanitizedReviews);
        } catch (error) {
            console.error("Fetch reviews error:", error);
            res.status(500).json({ message: "Lỗi khi lấy danh sách đánh giá." });
        }
    }
}

module.exports = ReviewController;
