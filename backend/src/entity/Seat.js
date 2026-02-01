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
        room_id: {
            type: "int",
            nullable: false
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
        status: {
            type: "varchar", // AVAILABLE, MAINTENANCE
            default: "AVAILABLE",
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
    },
    indices: [
        {
            name: "UQ_ROOM_ROW_COL",
            columns: ["room_id", "row_index", "column_index"],
            unique: true
        }
    ]
});
