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
        row_index: {
            type: "int",
            nullable: true
        },
        column_index: {
            type: "int",
            nullable: true
        },
        seat_code: {
            type: "varchar",
            nullable: true
        },
        seat_type: {
            type: "varchar", // STANDARD, VIP
            default: "STANDARD",
            nullable: true
        },
        price_multiplier: {
            type: "decimal",
            default: 1.0
        }
    },
    relations: {
        room: {
            target: "Room",
            type: "many-to-one",
            joinColumn: { name: "room_id" }
        }
    }
});
