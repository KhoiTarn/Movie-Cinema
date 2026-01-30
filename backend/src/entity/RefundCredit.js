const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "RefundCredit",
    tableName: "refund_credits",
    columns: {
        refund_credit_id: {
            primary: true,
            type: "int",
            generated: true
        },
        balance: {
            type: "decimal",
            precision: 18,
            scale: 2,
            default: 0
        },
        created_at: {
            type: "timestamp",
            createDate: true
        }
    },
    relations: {
        user: {
            target: "User",
            type: "one-to-one", // Assuming one wallet per user based on unique constraint logic usually, but dump doesn't show unique specific, using OneToOne is safer for wallet
            joinColumn: { name: "user_id" }
        }
    }
});
