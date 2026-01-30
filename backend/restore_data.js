const { AppDataSource } = require("./src/data-source");

const sampleMovies = [
    {
        title: "Mai",
        description: "Mai, mot co gai massage...",
        poster_url: "https://upload.wikimedia.org/wikipedia/vi/2/22/Mai_phim_2024.jpg",
        duration: 131,
        rating: "T18"
    },
    {
        title: "Kung Fu Panda 4",
        description: "Than Long Dai Hiep quay tro lai...",
        poster_url: "https://upload.wikimedia.org/wikipedia/vi/f/f6/Kung_Fu_Panda_4_poster.jpg",
        duration: 94,
        rating: "P"
    },
    {
        title: "Dune: Part Two",
        description: "Hanh trinh cua Paul Atreides...",
        poster_url: "https://upload.wikimedia.org/wikipedia/vi/5/52/Dune_Part_Two_poster.jpeg",
        duration: 166,
        rating: "T13"
    }
];

AppDataSource.initialize()
    .then(async () => {
        console.log("Restoring Movie Data...");
        const movieRepo = AppDataSource.getRepository("Movie");
        const movies = await movieRepo.find();

        if (movies.length > 0) {
            for (let i = 0; i < movies.length; i++) {
                const m = movies[i];
                // Update with sample data (looping if more movies than samples)
                const sample = sampleMovies[i % sampleMovies.length];

                // Only update if title or poster is missing
                if (!m.title || !m.poster_url) {
                    m.title = m.title || sample.title;
                    m.poster_url = m.poster_url || sample.poster_url;
                    // Also ensure description if needed
                    m.description = m.description || sample.description;

                    await movieRepo.save(m);
                    console.log(`Updated Movie ID ${m.movie_id} with title "${m.title}"`);
                }
            }
            console.log("Data Restoration Completed!");
        } else {
            console.log("No movies found to restore.");
        }
        process.exit();
    })
    .catch(error => {
        console.error("Error:", error);
        process.exit(1);
    });
