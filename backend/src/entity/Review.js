const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Review",
    tableName: "reviews",
    columns: {
        review_id: {
            primary: true,
            type: "int",
            generated: true
        },
        rating: {
            type: "int"
        },
        comment: {
            type: "text",
            nullable: true
        },
        created_at: {
            type: "timestamp",
            createDate: true
        }
    },
    relations: {
        movie: {
            target: "Movie",
            type: "many-to-one",
            joinColumn: { name: "movie_id" }
        },
        user: {
            target: "User",
            type: "many-to-one",
            joinColumn: { name: "user_id" }
        }
    }
});
