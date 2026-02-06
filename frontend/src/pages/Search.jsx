import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const Search = () => {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [searchParams] = useSearchParams();

    const selectedGenre = searchParams.get('genre_id') || '';
    const selectedAge = searchParams.get('age_rating') || '';
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        // Fetch genres to display name in title
        api.get('/genres').then(res => setGenres(res.data)).catch(err => console.error(err));
    }, []);

    useEffect(() => {
        let url = '/movies?';
        if (selectedGenre) url += `genre_id=${selectedGenre}&`;
        if (selectedAge) url += `age_rating=${selectedAge}&`;
        if (searchQuery) url += `search=${searchQuery}&`;

        api.get(url)
            .then(res => setMovies(res.data))
            .catch(err => console.error(err));
    }, [selectedGenre, selectedAge, searchQuery]);

    const getTitle = () => {
        if (searchQuery && selectedGenre) {
            const genre = genres.find(g => g.genre_id === parseInt(selectedGenre));
            return `Kết quả cho "${searchQuery}" trong thể loại ${genre ? genre.name : ''}`;
        }
        if (searchQuery) {
            return `Đã tìm thấy ${movies.length} kết quả cho "${searchQuery}"`;
        }
        if (selectedGenre) {
            const genre = genres.find(g => g.genre_id === parseInt(selectedGenre));
            return `Phim cho thể loại ${genre ? genre.name : 'đã chọn'}`;
        }
        if (selectedAge) {
            return `Phim độ tuổi ${selectedAge}`;
        }
        return "Kết quả tìm kiếm";
    };

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <div style={{ marginBottom: '30px' }}>
                <Link to="/" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.9rem', display: 'block', marginBottom: '10px' }}>
                    ← Quay lại trang chủ
                </Link>
                <h2 style={{ borderLeft: '4px solid var(--primary-color)', paddingLeft: '10px' }}>
                    {getTitle()}
                </h2>
            </div>

            {movies.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px' }}>
                    {movies.map(movie => (
                        <div key={movie.movie_id} className="card">
                            <Link to={`/movie/${movie.movie_id}`} style={{ display: 'block', height: '300px', backgroundColor: '#333', overflow: 'hidden', textDecoration: 'none' }}>
                                {movie.poster_url ? (
                                    <img src={movie.poster_url} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>No Poster</div>
                                )}
                            </Link>
                            <div style={{ padding: '15px' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{movie.title}</h3>
                                <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '15px' }}>{movie.duration_minutes} phút - {movie.age_rating}</p>
                                <Link to={`/movie/${movie.movie_id}`} className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>Đặt Vé</Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '100px 0', color: '#666' }}>
                    <p style={{ fontSize: '1.2rem' }}>Rất tiếc, không tìm thấy phim nào phù hợp với yêu cầu của bạn.</p>
                    <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '20px' }}>Xem tất cả phim</Link>
                </div>
            )}
        </div>
    );
};

export default Search;
