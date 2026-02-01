const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '../../.env') });
const { AppDataSource } = require("../data-source");

(async () => {
    try {
        await AppDataSource.initialize();
        console.log("DB Connected.");

        const roomRepo = AppDataSource.getRepository("Room");
        const seatRepo = AppDataSource.getRepository("Seat");

        const rooms = await roomRepo.find({ relations: ["seats"] });
        console.log(`Found ${rooms.length} rooms.`);

        for (const room of rooms) {
            const seatCount = room.seats ? room.seats.length : 0;
            console.log(`Room ${room.name} (ID: ${room.room_id}) has ${seatCount} seats.`);

            if (seatCount < 10) {
                console.log(`-> Populating 10x10 layout for Room ${room.name}...`);
                const rows = 10;
                const cols = 10;
                const newSeats = [];
                for (let r = 1; r <= rows; r++) {
                    for (let c = 1; c <= cols; c++) {
                        newSeats.push({
                            room: room,
                            row_index: r,
                            column_index: c,
                            seat_code: `${String.fromCharCode(64 + r)}${c}`,
                            seat_type: 'STANDARD',
                            status: 'AVAILABLE',
                            price_multiplier: 1.0
                        });
                    }
                }

                await seatRepo.save(newSeats);
                // Update room count
                room.seat_count = newSeats.length;
                await roomRepo.save(room);
                console.log(`   Created ${newSeats.length} seats.`);
            }
        }
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await AppDataSource.destroy();
        console.log("Done.");
    }
})();
