const { AppDataSource } = require("../data-source");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../middlewares/auth.middleware");

const userRepository = AppDataSource.getRepository("User");

class AuthController {

    // POST /api/auth/register
    static async register(req, res) {
        try {
            const { full_name, email, password } = req.body;

            // Validate input
            if (!full_name || !email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }

            // Check existing user
            const existingUser = await userRepository.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: "Email already exists" });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);

            // Create user
            const newUser = userRepository.create({
                full_name,
                email,
                password_hash,
                is_verified: true // Auto verify for demo
            });

            await userRepository.save(newUser);

            res.status(201).json({ message: "User registered successfully" });

        } catch (error) {
            console.error("Register Error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // POST /api/auth/login
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Check user
            const user = await userRepository.findOne({ where: { email } });
            if (!user) {
                return res.status(400).json({ message: "Invalid email or password" });
            }

            // Validate password
            const validPass = await bcrypt.compare(password, user.password_hash);
            if (!validPass) {
                return res.status(400).json({ message: "Invalid email or password" });
            }

            // Generate JWT
            const token = jwt.sign(
                { user_id: user.user_id, email: user.email },
                SECRET_KEY,
                { expiresIn: "10h" } // Token valid for 10 hours
            );

            res.json({
                message: "Login successful",
                token: token,
                user: {
                    user_id: user.user_id,
                    full_name: user.full_name,
                    email: user.email
                }
            });

        } catch (error) {
            console.error("Login Error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = AuthController;
