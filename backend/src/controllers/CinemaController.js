const { AppDataSource } = require("../data-source");

const cinemaRepository = AppDataSource.getRepository("Cinema");

class CinemaController {

    // GET /api/cinemas
    static async getAll(req, res) {
        try {
            const cinemas = await cinemaRepository.find({
                relations: ["rooms"]
            });
            res.json(cinemas);
        } catch (error) {
            console.error("Error fetching cinemas:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = CinemaController;
