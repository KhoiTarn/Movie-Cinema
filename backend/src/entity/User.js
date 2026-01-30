const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        user_id: {
            primary: true,
            type: "int",
            generated: true
        },
        email: {
            type: "varchar",
            unique: true
        },
        full_name: {
            type: "varchar"
        },
        password_hash: {
            type: "varchar"
        },
        is_verified: {
            type: "boolean",
            default: false
        },
        created_at: {
            type: "timestamp",
            createDate: true
        }
    }
});
