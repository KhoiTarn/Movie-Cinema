const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Seat",
    tableName: "seats",
    columns: {
        seat_id: {
            primary: true,
            type: "int",
            generated: true
        },
        seat_code: {
            type: "varchar"
        },
        seat_type: {
            type: "varchar" // NORMAL, VIP
        },
        row_index: {
            type: "int"
        },
        column_index: {
            type: "int"
        },
        price_multiplier: {
            type: "float", // or decimal
            default: 1
        },
        is_active: {
            type: "boolean",
            default: true
        }
    },
    relations: {
        screen: {
            target: "Screen",
            type: "many-to-one",
            joinColumn: { name: "screen_id" }
        }
    }
});
