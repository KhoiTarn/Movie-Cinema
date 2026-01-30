const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');

router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Return the full URL to the file
        // Assuming server runs on HTTP and port is in process.env.PORT or 3000
        const protocol = req.protocol;
        const host = req.get('host');
        const fileUrl = `${protocol}://${host}/upload/${req.file.filename}`;

        res.json({
            message: "File uploaded successfully",
            url: fileUrl
        });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: "Upload failed" });
    }
});

module.exports = router;
