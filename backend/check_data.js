const { AppDataSource } = require("./src/data-source");

AppDataSource.initialize()
    .then(async () => {
        console.log("Checking Movie Data...");
        const movieRepo = AppDataSource.getRepository("Movie");
        const movies = await movieRepo.find();

        console.log(`Found ${movies.length} movies.`);
        if (movies.length > 0) {
            movies.forEach(m => {
                console.log(`- ID: ${m.movie_id}, Title: "${m.title}", Poster: "${m.poster_url}"`);
            });
        } else {
            console.log("No movies found in the database!");
        }
        process.exit();
    })
    .catch(error => {
        console.error("Error:", error);
        process.exit(1);
    });
