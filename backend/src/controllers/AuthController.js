const { AppDataSource } = require("../data-source");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
const { sendEmail } = require("../services/EmailService");
const { SECRET_KEY } = require("../middlewares/auth.middleware");

const userRepository = AppDataSource.getRepository("User");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthController {

    // Register
    static async register(req, res) {
        try {
            const { full_name, email, password } = req.body;

            // Check existing
            const existingUser = await userRepository.findOne({ where: { email } });
            if (existingUser) return res.status(400).json({ message: "Email already exists" });

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = userRepository.create({
                full_name,
                email,
                password: hashedPassword,
                role: "USER"
            });

            await userRepository.save(user);
            res.status(201).json({ message: "User created successfully" });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }

    // Login (Standard)
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await userRepository.findOne({ where: { email } });

            if (!user) return res.status(400).json({ message: "Invalid credentials" });

            // If user has no password (e.g. Google only), deny standard login or ask to set pass
            if (!user.password) return res.status(400).json({ message: "Please login with Google" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

            // Generate Token
            const token = jwt.sign({ user_id: user.user_id, role: user.role }, SECRET_KEY, { expiresIn: "7d" });

            res.json({ token, user: { user_id: user.user_id, full_name: user.full_name, email: user.email } });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }

    // Google Login
    static async googleLogin(req, res) {
        try {
            const { credential } = req.body; // Google ID Token
            console.log("Received Google Login Request");
            console.log("Backend Configured Client ID:", process.env.GOOGLE_CLIENT_ID);
            console.log("Received Token (first 20 chars):", credential ? credential.substring(0, 20) : "No credential");

            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID, // Ensure backend .env has the same Client ID
            });
            const payload = ticket.getPayload();
            const { email, name, sub } = payload; // sub is google_id

            let user = await userRepository.findOne({ where: { email } });

            if (!user) {
                // Create new user
                user = userRepository.create({
                    email,
                    full_name: name,
                    google_id: sub,
                    role: "USER"
                });
                await userRepository.save(user);
            } else if (!user.google_id) {
                // Update existing user with google_id if missing
                user.google_id = sub;
                await userRepository.save(user);
            }

            const token = jwt.sign({ user_id: user.user_id, role: user.role }, SECRET_KEY, { expiresIn: "7d" });
            res.json({ token, user: { user_id: user.user_id, full_name: user.full_name, email: user.email } });

        } catch (error) {
            console.error("Google verify error DETAILS:", error.message);
            // Also log full error for context if needed
            console.error(error);
            res.status(400).json({ message: "Invalid Google Token: " + error.message });
        }
    }

    // Forgot Password - Send OTP
    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const user = await userRepository.findOne({ where: { email } });
            if (!user) return res.status(404).json({ message: "User not found" });

            // Generate 6 digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

            user.otp_code = otp;
            user.otp_expires_at = expiresAt;
            await userRepository.save(user);

            await sendEmail(email, "Password Reset OTP", `Your OTP code is: ${otp}`);
            res.json({ message: "OTP sent to email" });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error sending OTP" });
        }
    }

    // Verify OTP & Reset Password
    static async resetPassword(req, res) {
        try {
            const { email, otp, newPassword } = req.body;
            const user = await userRepository.findOne({ where: { email } });

            if (!user) return res.status(404).json({ message: "User not found" });

            if (user.otp_code !== otp || new Date() > new Date(user.otp_expires_at)) {
                return res.status(400).json({ message: "Invalid or expired OTP" });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.otp_code = null;
            user.otp_expires_at = null;

            await userRepository.save(user);
            res.json({ message: "Password updated successfully" });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }
}

module.exports = AuthController;
