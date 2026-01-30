const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Payment",
    tableName: "payments",
    columns: {
        payment_id: {
            primary: true,
            type: "int",
            generated: true
        },
        amount: {
            type: "decimal",
            precision: 18,
            scale: 2
        },
        payment_method: {
            type: "varchar"
        },
        status: {
            type: "varchar" // SUCCESS, FAILED
        },
        created_at: {
            type: "timestamp",
            createDate: true
        }
    },
    relations: {
        booking: {
            target: "Booking",
            type: "many-to-one", // One Booking can strictly have multiple payment attempts, or OneToOne? Usually 1 booking = 1 payment success, but failed attempts exist. Use ManyToOne safe.
            joinColumn: { name: "booking_id" }
        }
    }
});
