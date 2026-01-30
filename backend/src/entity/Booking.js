const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Booking",
    tableName: "bookings",
    columns: {
        booking_id: {
            primary: true,
            type: "int",
            generated: true
        },
        total_amount: {
            type: "decimal",
            precision: 18,
            scale: 2
        },
        discount_amount: {
            type: "decimal",
            precision: 18,
            scale: 2,
            nullable: true
        },
        final_amount: {
            type: "decimal",
            precision: 18,
            scale: 2
        },
        status: {
            type: "varchar" // e.g., CONFIRMED, PENDING, CANCELLED
        },
        created_at: {
            type: "timestamp",
            createDate: true
        }
    },
    relations: {
        user: {
            target: "User",
            type: "many-to-one",
            joinColumn: { name: "user_id" }
        },
        showtime: {
            target: "Showtime",
            type: "many-to-one",
            joinColumn: { name: "showtime_id" }
        }
    }
});
