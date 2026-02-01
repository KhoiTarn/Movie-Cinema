const { AppDataSource } = require("../data-source");

// Force exit after 10 seconds
setTimeout(() => {
    console.error("Script timed out. Exiting...");
    process.exit(1);
}, 10000);

async function fixSequence() {
    console.log("Starting DB Sequence Fix...");
    try {
        await AppDataSource.initialize();
        console.log("Database connected.");

        // 1. Check max room_id
        const resMax = await AppDataSource.query(`SELECT MAX(room_id) as max_id FROM rooms`);
        const maxId = parseInt(resMax[0].max_id || 0);
        console.log(`Current MAX(room_id): ${maxId}`);

        // 2. Identify sequence name
        // Since error mentioned 'screens_pkey', the sequence might be 'screens_room_id_seq' or 'screens_id_seq'
        // We will try to find it dynamically or fallback to common names.

        let seqName = null;

        // Try getting it from pg_get_serial_sequence
        const resSeq = await AppDataSource.query(`SELECT pg_get_serial_sequence('rooms', 'room_id') as seq`);
        seqName = resSeq[0].seq;

        if (!seqName) {
            console.log("Could not detect sequence via pg_get_serial_sequence. Trying 'screens_room_id_seq'...");
            seqName = 'screens_room_id_seq';
        }

        console.log(`Detected Sequence Name: ${seqName}`);

        if (seqName) {
            // 3. Reset sequence
            const newVal = maxId + 1;
            console.log(`Resetting sequence ${seqName} to ${newVal}...`);
            await AppDataSource.query(`SELECT setval('${seqName}', ${newVal}, false)`);
            console.log("Sequence reset DONE.");
        } else {
            console.error("No sequence found to reset!");
        }

    } catch (error) {
        console.error("Error fixing sequence:", error);
    } finally {
        await AppDataSource.destroy();
        process.exit(0);
    }
}

fixSequence();
