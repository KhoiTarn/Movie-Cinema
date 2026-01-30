const express = require("express");
const AuthController = require("../controllers/AuthController");
const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/google-login", AuthController.googleLogin);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/resend-verify", AuthController.resendVerify);

module.exports = router;
