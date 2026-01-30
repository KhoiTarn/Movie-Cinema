require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function verifyLogin() {
    console.log("Checking Email Configuration...");
    console.log("Email User:", process.env.EMAIL_USER);
    // Mask password for security in logs
    console.log("Email Pass:", process.env.EMAIL_PASS ? "******" + process.env.EMAIL_PASS.slice(-4) : "Not Set");

    try {
        await transporter.verify();
        console.log("✅ SUCCESS: Login to Gmail successful!");
    } catch (error) {
        console.error("❌ FAILED: Could not login to Gmail.");
        console.error("Error Code:", error.code);
        console.error("Response:", error.response);
        console.log("\nPossible solutions:");
        console.log("1. Check if EMAIL_USER has extra spaces.");
        console.log("2. Ensure EMAIL_PASS is the 16-character App Password, NOT your login password.");
        console.log("3. Make sure 2-Step Verification is enabled.");
    }
}

verifyLogin();
