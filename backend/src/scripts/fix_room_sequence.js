const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '../../.env') });
const { AppDataSource } = require("../data-source");

// Force exit after 10 seconds
setTimeout(() => {
    console.error("Script timed out. Exiting...");
    process.exit(1);
}, 10000);

async function fixSequence() {
    console.log("Starting script...");
    try {
        console.log("Initializing DataSource...");
        await AppDataSource.initialize();
        console.log("Database connected.");

        const tableName = "rooms";
        const columnName = "room_id";

        console.log(`Resetting sequence for ${tableName}.${columnName}...`);

        // Use a simpler query first to test connection
        const count = await AppDataSource.query(`SELECT count(*) FROM ${tableName}`);
        console.log(`Current room count: ${count[0].count}`);

        const result = await AppDataSource.query(`
            SELECT setval(
                pg_get_serial_sequence('${tableName}', '${columnName}'),
                COALESCE((SELECT MAX(${columnName}) FROM ${tableName}), 0) + 1,
                false
            );
        `);

        console.log("Sequence reset successful:", result);

    } catch (error) {
        console.error("Error fixing sequence:", error);
    } finally {
        console.log("Destroying DataSource...");
        await AppDataSource.destroy();
        console.log("Done.");
        process.exit(0);
    }
}

fixSequence();
