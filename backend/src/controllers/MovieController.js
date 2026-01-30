const { AppDataSource } = require("../data-source");

const movieRepository = AppDataSource.getRepository("Movie");

class MovieController {

    // GET /api/movies
    static async getAll(req, res) {
        try {
            const movies = await movieRepository.find({
                order: { created_at: "DESC" }
            });
            res.json(movies);
        } catch (error) {
            console.error("Error fetching movies:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // GET /api/movies/:id
    static async getOne(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (!id) return res.status(400).json({ message: "Invalid ID" });

            const movie = await movieRepository.findOne({
                where: { movie_id: id }
            });

            if (!movie) return res.status(404).json({ message: "Movie not found" });

            res.json(movie);
        } catch (error) {
            console.error("Error fetching movie details:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = MovieController;
