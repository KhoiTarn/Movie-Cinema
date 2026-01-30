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
        password: {
            type: "varchar",
            nullable: true // Allow null for Google Auth users
        },
        full_name: {
            type: "varchar"
        },
        role: {
            type: "varchar",
            default: "USER"
        },
        google_id: {
            type: "varchar",
            nullable: true,
            unique: true
        },
        otp_code: {
            type: "varchar",
            nullable: true
        },
        otp_expires_at: {
            type: "timestamp",
            nullable: true
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
