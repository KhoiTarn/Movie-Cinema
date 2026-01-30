const express = require('express');
const { AppDataSource } = require("./data-source");
const app = express();
const port = 3000;
const cors = require("cors");
const routes = require("./routes");

app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self' *; script-src 'self' * 'unsafe-inline' 'unsafe-eval'; style-src 'self' * 'unsafe-inline'; img-src 'self' * data:;");
    next();
});
app.use(express.json());
app.use("/api", routes);

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");

        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });
