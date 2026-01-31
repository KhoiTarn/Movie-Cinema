const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Cinema",
    tableName: "cinemas",
    columns: {
        cinema_id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar",
            nullable: true
        },
        address: {
            type: "text",
            nullable: true
        }
    },
    relations: {
        rooms: {
            target: "Room",
            type: "one-to-many",
            inverseSide: "cinema",
            cascade: true
        }
    }
});
