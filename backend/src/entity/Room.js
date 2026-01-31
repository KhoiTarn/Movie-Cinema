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
        }
    },
    relations: {
        cinema: {
            target: "Cinema",
            type: "many-to-one",
            joinColumn: { name: "cinema_id" }
        }
    }
});
