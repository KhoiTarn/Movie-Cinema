const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Screen",
    tableName: "screens",
    columns: {
        screen_id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar"
        },
        seat_count: {
            type: "int"
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
