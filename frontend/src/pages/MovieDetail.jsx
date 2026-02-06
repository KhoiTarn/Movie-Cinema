import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getYoutubeEmbedUrl } from '../utils/helpers';
import { AuthContext } from '../context/AuthContext';

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // 1. Get Movie Info
        api.get(`/movies/${id}`).then(res => setMovie(res.data));

        // 2. Get Showtimes
        api.get(`/showtimes?movie_id=${id}`).then(res => setShowtimes(res.data));

        // 3. Get Reviews
        fetchReviews();
    }, [id]);

    const fetchReviews = () => {
        api.get(`/reviews/movie/${id}`).then(res => setReviews(res.data));
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert("Vui lòng đăng nhập để đánh giá.");

        setIsSubmitting(true);
        try {
            await api.post('/reviews', {
                movie_id: id,
                rating: newRating,
                comment: newComment
            });
            setNewComment("");
            fetchReviews();
            // Optional: Refresh movie info to update rating_avg
            api.get(`/movies/${id}`).then(res => setMovie(res.data));
        } catch (error) {
            alert(error.response?.data?.message || "Lỗi khi gửi đánh giá.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!movie) return <div className="container" style={{ paddingTop: '50px' }}>Loading...</div>;

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <button
                onClick={() => navigate('/')}
                style={{
                    background: 'none',
                    border: '1px solid #555',
                    color: '#ccc',
                    padding: '8px 15px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    marginBottom: '20px'
                }}
            >
                ⬅ Trang chủ
            </button>
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
            {/* Review Section */}
            <div style={{ marginTop: '60px', borderTop: '1px solid #333', paddingTop: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.8rem' }}>Đánh giá từ khán giả ({reviews.length})</h2>
                    {movie.rating_avg > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#111', padding: '8px 15px', borderRadius: '20px', border: '1px solid var(--primary-color)' }}>
                            <span style={{ color: '#ffc107', fontSize: '1.2rem' }}>★</span>
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{movie.rating_avg}</span>
                            <span style={{ color: '#666' }}>/ 5</span>
                        </div>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '50px' }}>
                    {/* Review Form */}
                    <div>
                        <div style={{ backgroundColor: '#1a1a1a', padding: '25px', borderRadius: '12px', border: '1px solid #333' }}>
                            <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>{user ? "Viết đánh giá của bạn" : "Đăng nhập để đánh giá"}</h3>
                            {user ? (
                                <form onSubmit={handleReviewSubmit}>
                                    <div style={{ marginBottom: '20px' }}>
                                        <p style={{ marginBottom: '10px', color: '#aaa' }}>Bạn chấm phim này mấy sao?</p>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setNewRating(star)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        fontSize: '1.8rem',
                                                        cursor: 'pointer',
                                                        color: star <= newRating ? '#ffc107' : '#444',
                                                        transition: 'transform 0.1s'
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <textarea
                                            placeholder="Cảm nhận của bạn về bộ phim..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            style={{
                                                width: '100%',
                                                height: '120px',
                                                backgroundColor: '#111',
                                                border: '1px solid #333',
                                                borderRadius: '8px',
                                                padding: '12px',
                                                color: '#fff',
                                                fontSize: '0.95rem',
                                                resize: 'none'
                                            }}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn-primary"
                                        style={{ width: '100%', padding: '12px', fontWeight: 'bold' }}
                                    >
                                        {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                                    </button>
                                </form>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                    <Link to="/login" className="btn-primary" style={{ display: 'inline-block', padding: '10px 25px' }}>Đăng nhập ngay</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Review List */}
                    <div>
                        {reviews.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {reviews.map(rev => (
                                    <div key={rev.review_id} style={{ borderBottom: '1px solid #222', paddingBottom: '20px' }}>
                                        <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                                            <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                {rev.user.avatar_url ? <img src={rev.user.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : rev.user.full_name.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{rev.user.full_name}</div>
                                                <div style={{ color: '#ffc107', fontSize: '0.85rem' }}>
                                                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                                                    <span style={{ color: '#666', marginLeft: '10px' }}>{new Date(rev.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p style={{ color: '#ccc', lineHeight: '1.5', margin: 0 }}>{rev.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', color: '#666', paddingTop: '40px' }}>
                                🎬 Chưa có đánh giá nào. Hãy là người đầu tiên!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;
