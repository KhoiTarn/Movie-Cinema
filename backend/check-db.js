const { AppDataSource } = require("./src/data-source");

AppDataSource.initialize()
    .then(async () => {
        const queryRunner = AppDataSource.createQueryRunner();
        const columns = await queryRunner.getTable("users");
        console.log("Columns in 'users' table:", columns.columns.map(c => ({ name: c.name, type: c.type, isNullable: c.isNullable })));

        const count = await queryRunner.query("SELECT COUNT(*) FROM users WHERE email IS NULL");
        console.log("Users with NULL email:", count);

        const allUsers = await queryRunner.query("SELECT * FROM users LIMIT 5");
        console.log("Sample Users:", allUsers);

        await AppDataSource.destroy();
    })
    .catch(err => console.error(err));
