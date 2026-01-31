const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Showtime",
    tableName: "showtimes",
    columns: {
        showtime_id: {
            primary: true,
            type: "int",
            generated: true
        },
        base_price: {
            type: "decimal",
            precision: 18,
            scale: 2
        },
        start_time: {
            type: "timestamp"
        },
        end_time: {
            type: "timestamp"
        }
    },
    relations: {
        movie: {
            target: "Movie",
            type: "many-to-one",
            joinColumn: { name: "movie_id" }
        },
        room: {
            target: "Room",
            type: "many-to-one",
            joinColumn: { name: "room_id" }
        }
    }
});
