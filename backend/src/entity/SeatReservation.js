const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "SeatReservation",
    tableName: "seat_reservations",
    columns: {
        seat_reservation_id: {
            primary: true,
            type: "int",
            generated: true
        },
        status: {
            type: "varchar" // CONFIRMED, HOLD
        },
        price_at_booking: {
            type: "decimal",
            precision: 18,
            scale: 2
        },
        expired_at: {
            type: "timestamp",
            nullable: true
        }
    },
    relations: {
        showtime: {
            target: "Showtime",
            type: "many-to-one",
            joinColumn: { name: "showtime_id" }
        },
        booking: {
            target: "Booking",
            type: "many-to-one",
            joinColumn: { name: "booking_id" }
        },
        seat: {
            target: "Seat",
            type: "many-to-one",
            joinColumn: { name: "seat_id" }
        }
    }
});
