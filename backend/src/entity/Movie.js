const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Movie",
    tableName: "movies",
    columns: {
        movie_id: {
            primary: true,
            type: "int",
            generated: true
        },
        title: {
            type: "varchar",
            nullable: true
        },
        description: {
            type: "text",
            nullable: true
        },
        duration_minutes: {
            type: "int"
        },
        age_rating: {
            type: "varchar",
            length: 10
        },
        poster_url: {
            type: "varchar",
            nullable: true
        },
        rating_avg: {
            type: "decimal",
            precision: 3,
            scale: 2,
            default: 0
        },
        review_count: {
            type: "int",
            default: 0
        },
        created_at: {
            type: "timestamp",
            createDate: true
        }
    }
});
