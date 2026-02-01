import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getYoutubeEmbedUrl } from '../utils/helpers';

const ManageMovies = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        director: '',
        cast: '',
        duration: '',
        release_date: '',
        poster_url: '',
        trailer_url: '',
        genre_id: '',
        age_rating: ''
    });

    const AGE_RATINGS = [
        { value: 'P', label: 'P - Phổ biến mọi độ tuổi' },
        { value: 'K', label: 'K - Dưới 13 tuổi xem cùng người bảo hộ' },
        { value: 'C13', label: 'C13 - Cấm khán giả dưới 13 tuổi' },
        { value: 'C16', label: 'C16 - Cấm khán giả dưới 16 tuổi' },
        { value: 'C18', label: 'C18 - Cấm khán giả dưới 18 tuổi' }
    ];

    useEffect(() => {
        fetchMovies();
        fetchGenres();
    }, []);

    const fetchMovies = async () => {
        try {
            const res = await api.get('/movies');
            setMovies(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Fetch error:", error);
            setLoading(false);
        }
    };

    const fetchGenres = async () => {
        try {
            const res = await api.get('/genres');
            setGenres(res.data);
        } catch (error) {
            console.error("Fetch genres error:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa phim này?")) {
            try {
                await api.delete(`/movies/${id}`);
                fetchMovies();
            } catch (error) {
                alert("Xóa thất bại");
            }
        }
    };

    const handleEdit = (movie) => {
        setEditingMovie(movie);
        setFormData({
            title: movie.title,
            description: movie.description || '',
            director: movie.director || '',
            cast: movie.cast || '',
            duration: movie.duration_minutes || '',
            release_date: movie.release_date ? movie.release_date.split('T')[0] : '',
            poster_url: movie.poster_url || '',
            trailer_url: movie.trailer_url || '',
            genre_id: movie.genres ? movie.genres.genre_id : '',
            age_rating: movie.age_rating || ''
        });
        setShowModal(true);
    };

    const handleAddNew = () => {
        setEditingMovie(null);
        setFormData({
            title: '', description: '', director: '', cast: '', duration: '', release_date: '', poster_url: '', trailer_url: '', genre_id: '', age_rating: 'P'
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                duration: formData.duration // Send generic duration, backend will map to duration_minutes
            };
            if (editingMovie) {
                await api.put(`/movies/${editingMovie.movie_id}`, payload);
            } else {
                await api.post('/movies', payload);
            }
            setShowModal(false);
            fetchMovies();
        } catch (error) {
            console.error("Save error:", error);
            alert("Lưu thất bại");
        }
    };

    const handlePosterUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const data = new FormData();
        data.append('image', file);
        try {
            const res = await api.post('/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData({ ...formData, poster_url: res.data.url });
        } catch (err) {
            alert("Upload ảnh thất bại");
        }
    };

    return (
        <div style={{ padding: '20px', color: '#fff' }}>
            <style>
                {`
                    input[type="date"]::-webkit-calendar-picker-indicator {
                        filter: invert(1);
                        cursor: pointer;
                    }
                `}
            </style>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button
                        onClick={() => navigate('/admin')}
                        style={{
                            background: 'none',
                            border: '1px solid #555',
                            color: '#ccc',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        ⬅ Quay lại
                    </button>
                    <h1 style={{ margin: 0 }}>Quản lý Phim</h1>
                </div>
                <button onClick={handleAddNew} style={{ padding: '10px 20px', backgroundColor: 'var(--primary-color)', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>
                    + Thêm Phim
                </button>
            </div>

            {loading ? <p>Loading...</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1a1a1a', borderRadius: '8px', overflow: 'hidden' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#333', textAlign: 'left' }}>
                            <th style={{ padding: '15px' }}>ID</th>
                            <th style={{ padding: '15px' }}>Poster</th>
                            <th style={{ padding: '15px' }}>Tên Phim</th>
                            <th style={{ padding: '15px' }}>Thời lượng</th>
                            <th style={{ padding: '15px' }}>Độ tuổi</th>
                            {/* Removed Trailer Column */}
                            <th style={{ padding: '15px' }}>Ngày chiếu</th>
                            <th style={{ padding: '15px', textAlign: 'right' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map(movie => (
                            <tr key={movie.movie_id} style={{ borderBottom: '1px solid #333' }}>
                                <td style={{ padding: '15px' }}>{movie.movie_id}</td>
                                <td style={{ padding: '15px' }}>
                                    {movie.poster_url && <img src={movie.poster_url} alt="" style={{ width: '50px', height: '75px', objectFit: 'cover' }} />}
                                </td>
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>{movie.title}</td>
                                <td style={{ padding: '15px' }}>{movie.duration_minutes} phút</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ padding: '3px 8px', borderRadius: '4px', backgroundColor: '#333', fontSize: '0.8rem' }}>
                                        {movie.age_rating}
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>{new Date(movie.release_date).toLocaleDateString()}</td>
                                <td style={{ padding: '15px', textAlign: 'right' }}>
                                    <button onClick={() => handleEdit(movie)} style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}>Edit</button>
                                    <button onClick={() => handleDelete(movie.movie_id)} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#222', padding: '30px', borderRadius: '8px', width: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2>{editingMovie ? 'Cập nhật Phim' : 'Thêm Phim Mới'}</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input
                                placeholder="Tên phim"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                style={{ padding: '10px', backgroundColor: '#111', border: '1px solid #333', color: '#fff' }}
                                required
                            />
                            <textarea
                                placeholder="Mô tả"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                style={{ padding: '10px', backgroundColor: '#111', border: '1px solid #333', color: '#fff', minHeight: '100px' }}
                            />

                            {/* Genre & Age Rating */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <select
                                    value={formData.genre_id}
                                    onChange={e => setFormData({ ...formData, genre_id: e.target.value })}
                                    style={{ padding: '10px', backgroundColor: '#111', border: '1px solid #333', color: '#fff' }}
                                    required
                                >
                                    <option value="">-- Chọn Thể Loại --</option>
                                    {genres.map(g => (
                                        <option key={g.genre_id} value={g.genre_id}>{g.name}</option>
                                    ))}
                                </select>

                                <select
                                    value={formData.age_rating}
                                    onChange={e => setFormData({ ...formData, age_rating: e.target.value })}
                                    style={{ padding: '10px', backgroundColor: '#111', border: '1px solid #333', color: '#fff' }}
                                    required
                                >
                                    <option value="">-- Chọn Độ Tuổi --</option>
                                    {AGE_RATINGS.map(r => (
                                        <option key={r.value} value={r.value}>{r.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <input
                                    placeholder="Đạo diễn"
                                    value={formData.director}
                                    onChange={e => setFormData({ ...formData, director: e.target.value })}
                                    style={{ padding: '10px', backgroundColor: '#111', border: '1px solid #333', color: '#fff' }}
                                />
                                <input
                                    placeholder="Diễn viên"
                                    value={formData.cast}
                                    onChange={e => setFormData({ ...formData, cast: e.target.value })}
                                    style={{ padding: '10px', backgroundColor: '#111', border: '1px solid #333', color: '#fff' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <input
                                    type="number"
                                    placeholder="Thời lượng (phút)"
                                    value={formData.duration}
                                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                    style={{ padding: '10px', backgroundColor: '#111', border: '1px solid #333', color: '#fff' }}
                                />
                                <input
                                    type="date"
                                    placeholder="Ngày công chiếu"
                                    value={formData.release_date}
                                    onChange={e => setFormData({ ...formData, release_date: e.target.value })}
                                    style={{
                                        padding: '10px',
                                        backgroundColor: '#111',
                                        border: '1px solid #333',
                                        color: '#fff',
                                        colorScheme: 'dark' // Forces browser to use light icons
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#aaa' }}>Poster Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePosterUpload}
                                    style={{ padding: '10px', backgroundColor: '#111', border: '1px solid #333', color: '#fff', width: '100%' }}
                                />
                                {formData.poster_url && <img src={formData.poster_url} alt="Preview" style={{ marginTop: '10px', height: '100px' }} />}
                            </div>

                            <input
                                placeholder="Trailer URL (Youtube Embed Link)"
                                value={formData.trailer_url}
                                onChange={e => setFormData({ ...formData, trailer_url: e.target.value })}
                                style={{ padding: '10px', backgroundColor: '#111', border: '1px solid #333', color: '#fff' }}
                            />
                            {formData.trailer_url && (
                                <div style={{ marginTop: '10px' }}>
                                    <iframe
                                        width="100%"
                                        height="200"
                                        src={getYoutubeEmbedUrl(formData.trailer_url)}
                                        title="Trailer Preview"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid #555', color: '#fff', cursor: 'pointer' }}>Hủy</button>
                                <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'var(--primary-color)', border: 'none', color: '#fff', cursor: 'pointer' }}>Lưu thay đổi</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageMovies;
