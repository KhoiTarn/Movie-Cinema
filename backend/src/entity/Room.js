const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Room",
    tableName: "rooms",
    columns: {
        room_id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar",
            nullable: true
        },
        seat_count: {
            type: "int",
            nullable: true
        },
        status: {
            type: "varchar", // AVAILABLE, MAINTENANCE
            default: "AVAILABLE",
            nullable: true
        }
    },
    relations: {
        cinema: {
            target: "Cinema",
            type: "many-to-one",
            joinColumn: { name: "cinema_id" }
        },
        seats: {
            target: "Seat",
            type: "one-to-many",
            inverseSide: "room",
            cascade: true // creating room should not necessarily create seats, but deleting room should delete seats
        }
    }
});
