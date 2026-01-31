const { AppDataSource } = require("../data-source");

const genreRepository = AppDataSource.getRepository("Genre");

class GenreController {
    static async getAll(req, res) {
        try {
            const genres = await genreRepository.find();
            res.json(genres);
        } catch (error) {
            console.error("fetch genres error", error);
            res.status(500).json({ message: "Server error" });
        }
    }
}

module.exports = GenreController;
