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
    // POST /api/movies (Admin only)
    static async createMovie(req, res) {
        try {
            const { title, description, director, cast, duration, release_date, poster_url, trailer_url, genre_id } = req.body;

            let genre = null;
            if (genre_id) {
                genre = await AppDataSource.getRepository("Genre").findOne({ where: { genre_id: parseInt(genre_id) } });
            }

            const movie = movieRepository.create({
                title, description, director, cast,
                duration_minutes: duration ? parseInt(duration) : null,
                release_date, poster_url, trailer_url,
                genres: genre,
                age_rating
            });

            await movieRepository.save(movie);
            res.status(201).json(movie);
        } catch (error) {
            console.error("Create Movie Error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // PUT /api/movies/:id (Admin only)
    static async updateMovie(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { title, description, director, cast, duration, release_date, poster_url, trailer_url, genre_id, age_rating } = req.body;

            const movie = await movieRepository.findOne({ where: { movie_id: id } });
            if (!movie) return res.status(404).json({ message: "Movie not found" });

            movie.title = title || movie.title;
            movie.description = description || movie.description;
            movie.director = director || movie.director;
            movie.cast = cast || movie.cast;
            movie.duration_minutes = duration ? parseInt(duration) : movie.duration_minutes;
            movie.release_date = release_date || movie.release_date;
            movie.poster_url = poster_url || movie.poster_url;
            movie.trailer_url = trailer_url || movie.trailer_url;
            movie.age_rating = age_rating || movie.age_rating;
            if (genre_id) {
                const genre = await AppDataSource.getRepository("Genre").findOne({ where: { genre_id: parseInt(genre_id) } });
                if (genre) {
                    movie.genres = genre;
                }
            }

            await movieRepository.save(movie);
            res.json(movie);
        } catch (error) {
            console.error("Update Movie Error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // DELETE /api/movies/:id (Admin only)
    static async deleteMovie(req, res) {
        try {
            const id = parseInt(req.params.id);
            const movie = await movieRepository.findOne({ where: { movie_id: id } });

            if (!movie) return res.status(404).json({ message: "Movie not found" });

            await movieRepository.remove(movie);
            res.json({ message: "Movie deleted successfully" });
        } catch (error) {
            console.error("Delete Movie Error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = MovieController;
