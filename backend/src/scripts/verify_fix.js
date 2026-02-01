const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '../../.env') });
const { AppDataSource } = require("../data-source");

(async () => {
    try {
        await AppDataSource.initialize();
        console.log("DB Connected.");

        const table = 'rooms';
        const col = 'room_id';

        // 1. Get stats
        const [maxRes] = await AppDataSource.query(`SELECT MAX(${col}) as m FROM ${table}`);
        const maxId = parseInt(maxRes.m || 0);

        // 2. Try to get sequence value
        // Note: currval requires setval or nextval to be called in session, so we use last_value from sequence relation if possible
        // But simplest to just try catch insert
        console.log(`Max Room ID: ${maxId}`);

        try {
            await AppDataSource.query(`
                SELECT setval(pg_get_serial_sequence('${table}', '${col}'), ${maxId + 1}, false);
            `);
            console.log("Sequence force reset to " + (maxId + 1));
        } catch (e) {
            console.log("Failed to reset via pg_get_serial_sequence. Trying hardcoded names...");
            const seqs = ['screens_pkey', 'screens_room_id_seq', 'rooms_room_id_seq'];
            for (const s of seqs) {
                try {
                    await AppDataSource.query(`SELECT setval('${s}', ${maxId + 1}, false)`);
                    console.log(`Success calling setval on '${s}'`);
                    break;
                } catch (err) { }
            }
        }

        // 3. Test Insert (Rollback)
        const qr = AppDataSource.createQueryRunner();
        await qr.connect();
        await qr.startTransaction();
        try {
            const res = await qr.query(`INSERT INTO rooms (name, cinema_id, status) VALUES ('TEST_ROOM_SEQ', 1, 'AVAILABLE') RETURNING room_id`);
            console.log("Test Insert Success! New ID:", res[0].room_id);
            await qr.rollbackTransaction(); // Don't actually keep it
        } catch (err) {
            console.error("Test Insert Failed:", err.message);
            await qr.rollbackTransaction();
        } finally {
            await qr.release();
        }

    } catch (e) {
        console.error(e);
    } finally {
        await AppDataSource.destroy();
    }
})();
