const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "MovieGenre",
    tableName: "movie_genres",
    columns: {
        movie_id: {
            primary: true,
            type: "int"
        },
        genre_id: {
            primary: true,
            type: "int"
        }
    },
    relations: {
        movie: {
            target: "Movie",
            type: "many-to-one",
            joinColumn: { name: "movie_id" }
        },
        genre: {
            target: "Genre",
            type: "many-to-one",
            joinColumn: { name: "genre_id" }
        }
    }
});
