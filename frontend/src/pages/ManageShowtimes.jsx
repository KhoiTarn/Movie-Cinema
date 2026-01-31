import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ManageShowtimes = () => {
    const [showtimes, setShowtimes] = useState([]);
    const [movies, setMovies] = useState([]);
    const [cinemas, setCinemas] = useState([]); // We need to fetch cinemas to get rooms? Or fetch rooms directly?
    // Actually fetches rooms might be better if we have an API. 
    // But usually we select Cinema -> then Room. 
    // For simplicity, let's assuming we fetch all rooms or cinemas structure.
    // Let's fetch Cinemas which includes rooms if possible, or fetch all rooms.
    // Wait, we don't have get all rooms API yet for Admin?
    // We can use Cinema API if it returns rooms.

    // Let's create a simple flow: Fetch Movies. Fetch Cinemas (which should have rooms or we fetch rooms by cinema).
    const [rooms, setRooms] = useState([]);

    const [formData, setFormData] = useState({
        movie_id: '',
        room_id: '',
        start_time: '',
        base_price: 50000
    });

    useEffect(() => {
        fetchShowtimes();
        fetchMovies();
        fetchCinemasAndRooms();
    }, []);

    const fetchShowtimes = async () => {
        try {
            const res = await api.get('/showtimes?limit=100'); // Assuming get all returns enough or we add a specific admin endpoint
            setShowtimes(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMovies = async () => {
        try {
            const res = await api.get('/movies');
            setMovies(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCinemasAndRooms = async () => {
        try {
            // Check if we have an API for this. If not, we might need to add one.
            // Existing CinemaController might return rooms?
            const res = await api.get('/cinemas');
            // Assuming res.data is list of cinemas.
            // Ideally Cinema entity has OneToMany Rooms.
            // Let's assume we can flatten this for the select box "Cinema Name - Room Name"

            // Wait, Cinema endpoint might not include rooms relations by default.
            // If it doesn't, we might need to update CinemaController.
            // But let's try to see if we can just get rooms directly if we had an endpoint.
            // Since we don't have a specific /rooms endpoint yet, let's assume /cinemas returns them or we add it?
            // To be safe I'll fetch cinemas and hopefully they have rooms, or I'll assume a structure.
            // For now, let's assume /cinemas includes rooms relations. If not we will fix backend.
            setCinemas(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa lịch chiếu này?")) return;
        try {
            await api.delete(`/showtimes/${id}`);
            alert("Xóa thành công!");
            fetchShowtimes();
        } catch (err) {
            alert("Xóa thất bại");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/showtimes', formData);
            alert("Thêm lịch chiếu thành công!");
            fetchShowtimes();
            setFormData({ ...formData, start_time: '' }); // Reset time only ?
        } catch (err) {
            alert(err.response?.data?.message || "Thêm thất bại");
        }
    };

    // Helper to get all rooms from cinemas
    const getAllRooms = () => {
        let allRooms = [];
        cinemas.forEach(cinema => {
            if (cinema.rooms && cinema.rooms.length > 0) {
                cinema.rooms.forEach(room => {
                    allRooms.push({ ...room, cinema_name: cinema.name });
                });
            }
        });
        return allRooms;
    };

    const availableRooms = getAllRooms();

    return (
        <div className="container" style={{ padding: '20px' }}>
            <h2>Quản lý Lịch Chiếu</h2>

            <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <h3>Thêm Lịch Chiếu Mới</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', gridTemplateColumns: '1fr 1fr' }}>

                    {/* Select Movie */}
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label>Phim</label>
                        <select
                            className="form-control"
                            value={formData.movie_id}
                            onChange={(e) => setFormData({ ...formData, movie_id: e.target.value })}
                            required
                        >
                            <option value="">-- Chọn Phim --</option>
                            {movies.map(movie => (
                                <option key={movie.movie_id} value={movie.movie_id}>
                                    {movie.title} ({movie.duration_minutes || 'N/A'} mins)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Select Room */}
                    <div>
                        <label>Rạp / Phòng</label>
                        <select
                            className="form-control"
                            value={formData.room_id}
                            onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
                            required
                        >
                            <option value="">-- Chọn Phòng --</option>
                            {availableRooms.map(room => (
                                <option key={room.room_id} value={room.room_id}>
                                    {room.cinema_name} - {room.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Start Time */}
                    <div>
                        <label>Thời gian chiếu</label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            value={formData.start_time}
                            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                            required
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label>Giá vé cơ bản (VNĐ)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={formData.base_price}
                            onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                            required
                        />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Thêm Lịch Chiếu</button>
                    </div>
                </form>
            </div>

            {/* List */}
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#333', color: '#fff' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th style={{ padding: '10px' }}>Phim</th>
                        <th style={{ padding: '10px' }}>Rạp / Phòng</th>
                        <th style={{ padding: '10px' }}>Thời gian</th>
                        <th style={{ padding: '10px' }}>Giá vé</th>
                        <th style={{ padding: '10px' }}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {showtimes.map(st => (
                        <tr key={st.showtime_id} style={{ borderBottom: '1px solid #333' }}>
                            <td style={{ padding: '10px' }}>{st.showtime_id}</td>
                            <td style={{ padding: '10px' }}>
                                {st.movie?.title}
                                <br />
                                <span style={{ fontSize: '0.8rem', color: '#aaa' }}>
                                    Duration: {st.movie?.duration_minutes} mins
                                </span>
                            </td>
                            <td style={{ padding: '10px' }}>
                                {st.room?.cinema?.name} - {st.room?.name}
                            </td>
                            <td style={{ padding: '10px' }}>{new Date(st.start_time).toLocaleString()}</td>
                            <td style={{ padding: '10px' }}>{parseInt(st.base_price).toLocaleString()}đ</td>
                            <td style={{ padding: '10px' }}>
                                <button
                                    onClick={() => handleDelete(st.showtime_id)}
                                    style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageShowtimes;
