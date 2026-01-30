import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        api.get('/movies')
            .then(res => setMovies(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <h2 style={{ marginBottom: '30px', borderLeft: '4px solid var(--primary-color)', paddingLeft: '10px' }}>Phim Đang Chiếu</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px' }}>
                {movies.map(movie => (
                    <div key={movie.movie_id} className="card">
                        <div style={{ height: '300px', backgroundColor: '#333', overflow: 'hidden' }}>
                            {/* Placeholder for Poster if url is null */}
                            {movie.poster_url ? (
                                <img src={movie.poster_url} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>No Poster</div>
                            )}
                        </div>
                        <div style={{ padding: '15px' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{movie.title}</h3>
                            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '15px' }}>{movie.duration_minutes} phút - {movie.age_rating}</p>
                            <Link to={`/movie/${movie.movie_id}`} className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>Đặt Vé</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
