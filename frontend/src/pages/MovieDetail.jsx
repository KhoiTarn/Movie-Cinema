import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { getYoutubeEmbedUrl } from '../utils/helpers';

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);

    useEffect(() => {
        // 1. Get Movie Info
        api.get(`/movies/${id}`).then(res => setMovie(res.data));

        // 2. Get Showtimes
        api.get(`/showtimes?movie_id=${id}`).then(res => setShowtimes(res.data));
    }, [id]);

    if (!movie) return <div className="container" style={{ paddingTop: '50px' }}>Loading...</div>;

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <div style={{ display: 'flex', gap: '40px', marginBottom: '40px' }}>
                <div style={{ width: '300px', flexShrink: 0 }}>
                    <div style={{ height: '450px', backgroundColor: '#333' }}>
                        {movie.poster_url ? <img src={movie.poster_url} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'No Poster'}
                    </div>
                    {/* Trailer Embed */}
                    {movie.trailer_url && (
                        <div style={{ marginTop: '20px' }}>
                            <iframe
                                width="100%"
                                height="200"
                                src={getYoutubeEmbedUrl(movie.trailer_url)}
                                title="Trailer"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ borderRadius: '4px' }}
                            ></iframe>
                        </div>
                    )}
                </div>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{movie.title}</h1>
                    <div style={{ display: 'flex', gap: '15px', color: '#aaa', marginBottom: '20px' }}>
                        <span>{movie.duration_minutes} phút</span>
                        <span>|</span>
                        <span>{movie.age_rating}</span>
                        <span>|</span>
                        <span>{new Date(movie.created_at).getFullYear()}</span>
                    </div>
                    <p style={{ lineHeight: '1.6', marginBottom: '30px', maxWidth: '800px' }}>{movie.description || "Phim chưa có mô tả."}</p>

                    <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Lịch Chiếu</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
                        {showtimes.length > 0 ? showtimes.map(st => (
                            <Link to={`/booking/${st.showtime_id}`} key={st.showtime_id} style={{
                                backgroundColor: '#333',
                                padding: '10px',
                                borderRadius: '4px',
                                textAlign: 'center',
                                border: '1px solid #444',
                                transition: 'all 0.2s'
                            }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                                    {new Date(st.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                                    {new Date(st.start_time).toLocaleDateString()}
                                </div>
                                <div style={{ fontSize: '0.8rem', marginTop: '5px', color: 'var(--primary-color)' }}>
                                    {parseInt(st.base_price).toLocaleString()}đ
                                </div>
                            </Link>
                        )) : <p>Chưa có lịch chiếu.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;
