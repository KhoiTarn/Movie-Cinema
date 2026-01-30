const jwt = require("jsonwebtoken");

const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY || "fallback_secret_key";

const authMiddleware = (req, res, next) => {
    // Get token from header: "Authorization: Bearer <token>"
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // extract token after 'Bearer'

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided!" });
    }

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified; // attach user payload to request
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = { authMiddleware, SECRET_KEY };
