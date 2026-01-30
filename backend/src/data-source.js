require("dotenv").config();
const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "datvexemphim",
    synchronize: true, // Turned on to update schema (add missing columns like role, google_id)
    logging: false,
    entities: [
        "src/entity/**/*.js"
    ],
    migrations: [],
    subscribers: [],
});

module.exports = { AppDataSource };
