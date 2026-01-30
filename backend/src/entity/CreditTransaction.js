const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "CreditTransaction",
    tableName: "credit_transactions",
    columns: {
        credit_transaction_id: {
            primary: true,
            type: "int",
            generated: true
        },
        amount: {
            type: "decimal",
            precision: 18,
            scale: 2
        },
        transaction_type: {
            type: "varchar" // ADD, USE, REFUND
        },
        created_at: {
            type: "timestamp",
            createDate: true
        }
    },
    relations: {
        refund_credit: {
            target: "RefundCredit",
            type: "many-to-one",
            joinColumn: { name: "refund_credit_id" }
        },
        booking: {
            target: "Booking",
            type: "many-to-one",
            joinColumn: { name: "booking_id" },
            nullable: true
        }
    }
});
