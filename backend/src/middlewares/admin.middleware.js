const { AppDataSource } = require("../data-source");
const userRepository = AppDataSource.getRepository("User");

const isAdmin = async (req, res, next) => {
    try {
        // req.user is set by authMiddleware
        const userId = req.user.user_id;
        const user = await userRepository.findOne({ where: { user_id: userId } });

        if (!user || !user.role || user.role.toLowerCase() !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin role required." });
        }

        next();
    } catch (error) {
        console.error("Admin Middleware Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = isAdmin;
