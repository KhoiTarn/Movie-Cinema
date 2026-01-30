const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Genre",
    tableName: "genres",
    columns: {
        genre_id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar",
            nullable: true
        }
    }
});
