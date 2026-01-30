import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Booking = () => {
    const { showtimeId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [showtime, setShowtime] = useState(null);
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load data
    useEffect(() => {
        // 1. Get Showtime Detail
        api.get(`/showtimes/${showtimeId}`).then(res => setShowtime(res.data));

        // 2. Get Seats Status
        api.get(`/showtimes/${showtimeId}/seats`).then(res => {
            setSeats(res.data);
            setLoading(false);
        });
    }, [showtimeId]);

    const toggleSeat = (seatId) => {
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(id => id !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const handleBooking = async () => {
        if (!user) {
            alert("Vui lòng đăng nhập để đặt vé!");
            navigate('/login');
            return;
        }

        if (selectedSeats.length === 0) {
            alert("Vui lòng chọn ít nhất 1 ghế!");
            return;
        }

        if (!window.confirm(`Xác nhận đặt ${selectedSeats.length} vé?`)) return;

        try {
            await api.post('/bookings', {
                showtime_id: showtimeId,
                seat_ids: selectedSeats
            });
            alert("Đặt vé thành công!");
            navigate('/my-bookings');
        } catch (error) {
            alert(error.response?.data?.message || "Đặt vé thất bại");
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '50px' }}>Loading Seats...</div>;

    // Group seats by row
    const rows = {};
    seats.forEach(seat => {
        if (!rows[seat.row_index]) rows[seat.row_index] = [];
        rows[seat.row_index].push(seat);
    });

    const totalPrice = selectedSeats.reduce((total, seatId) => {
        const seat = seats.find(s => s.seat_id === seatId);
        return total + (showtime ? (showtime.base_price * seat.price_multiplier) : 0);
    }, 0);

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            {showtime && (
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2>{showtime.movie.title} - {showtime.screen.name}</h2>
                    <p>{new Date(showtime.start_time).toLocaleString()}</p>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ maxWidth: '600px', width: '100%' }}>
                    <div style={{ height: '10px', backgroundColor: '#555', borderRadius: '50%', marginBottom: '40px', boxShadow: '0 10px 20px rgba(255,255,255,0.1)' }}></div> {/* Screen */}
                    <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>MÀN HÌNH</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        {Object.keys(rows).sort((a, b) => a - b).map(rowIndex => (
                            <div key={rowIndex} style={{ display: 'flex', gap: '10px' }}>
                                {rows[rowIndex].sort((a, b) => a.column_index - b.column_index).map(seat => {
                                    const isBooked = seat.status === 'BOOKED';
                                    const isSelected = selectedSeats.includes(seat.seat_id);
                                    let bgColor = '#444'; // Available
                                    if (isBooked) bgColor = '#222'; // Sold
                                    if (isSelected) bgColor = 'var(--primary-color)'; // Selected

                                    return (
                                        <button
                                            key={seat.seat_id}
                                            disabled={isBooked}
                                            onClick={() => toggleSeat(seat.seat_id)}
                                            title={`${seat.seat_code} - ${seat.seat_type}`}
                                            style={{
                                                width: '35px',
                                                height: '35px',
                                                backgroundColor: bgColor,
                                                color: 'white',
                                                borderRadius: '4px',
                                                fontSize: '0.8rem',
                                                cursor: isBooked ? 'not-allowed' : 'pointer',
                                                opacity: isBooked ? 0.3 : 1
                                            }}
                                        >
                                            {seat.seat_code}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '40px', borderTop: '1px solid #333', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ marginBottom: '5px' }}>Đang chọn: {selectedSeats.length} ghế</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Tổng tiền: {totalPrice.toLocaleString()}đ</div>
                        </div>
                        <button onClick={handleBooking} className="btn-primary" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>XÁC NHẬN</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
