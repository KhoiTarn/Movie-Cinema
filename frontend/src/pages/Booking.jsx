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
        <div className="container" style={{ padding: '40px 0' }}>
            <button
                onClick={() => navigate(-1)}
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
                ⬅ Quay lại
            </button>
            <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>

                {/* L E F T   S I D E   ( 7 0 % )   -   S E A T   S E L E C T I O N */}
                <div style={{ flex: 7, backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #222' }}>
                    <div style={{ height: '8px', backgroundColor: '#555', borderRadius: '50%', marginBottom: '40px', boxShadow: '0 10px 30px rgba(255,255,255,0.1)' }}></div>
                    <p style={{ textAlign: 'center', marginBottom: '30px', color: '#444', letterSpacing: '2px', fontSize: '0.8rem' }}>MÀN HÌNH</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        {Object.keys(rows).sort((a, b) => a - b).map(rowIndex => (
                            <div key={rowIndex} style={{ display: 'flex', gap: '8px' }}>
                                {rows[rowIndex].sort((a, b) => a.column_index - b.column_index).map(seat => {
                                    const isBooked = seat.status === 'BOOKED';
                                    const isSelected = selectedSeats.includes(seat.seat_id);

                                    // Generate label: A1, A2, B1...
                                    const rowLabel = String.fromCharCode(64 + parseInt(seat.row_index)); // 1->A, 2->B
                                    const seatLabel = `${rowLabel}${seat.column_index}`;

                                    let bgColor = '#fff'; // Available - White
                                    let color = '#000'; // Available - Black Text

                                    if (isBooked) {
                                        bgColor = '#555'; // Sold - Grey
                                        color = '#ccc';
                                    } else if (isSelected) {
                                        bgColor = '#e60000ff'; // Selected - Green
                                        color = '#fff';
                                    }

                                    return (
                                        <button
                                            key={seat.seat_id}
                                            disabled={isBooked}
                                            onClick={() => toggleSeat(seat.seat_id)}
                                            title={`${seatLabel} - ${seat.seat_type}`}
                                            style={{
                                                width: '45px',
                                                height: '40px',
                                                backgroundColor: bgColor,
                                                color: color,
                                                borderRadius: '4px',
                                                fontSize: '0.85rem',
                                                fontWeight: 'bold',
                                                cursor: isBooked ? 'not-allowed' : 'pointer',
                                                border: 'none',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {seatLabel}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '20px', color: '#aaa', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '20px', height: '20px', backgroundColor: '#fff', borderRadius: '4px' }}></div> Ghế trống</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '20px', height: '20px', backgroundColor: '#e60000ff', borderRadius: '4px' }}></div> Đang chọn</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '20px', height: '20px', backgroundColor: '#555', borderRadius: '4px' }}></div> Đã bán</div>
                    </div>
                </div>

                {/* R I G H T   S I D E   ( 3 0 % )   -   B O O K I N G   I N F O */}
                <div style={{ flex: 3, backgroundColor: '#1a1a1a', padding: '25px', borderRadius: '12px', border: '1px solid #333', position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {showtime && (
                        <div style={{ borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                            <h3 style={{ margin: '0 0 10px', color: 'var(--primary-color)' }}>{showtime.movie.title}</h3>
                            <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#fff' }}><strong>Rạp:</strong> {showtime.room.name}</p>
                            <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#aaa' }}>Running time: {new Date(showtime.start_time).toLocaleString()}</p>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111', padding: '15px', borderRadius: '8px' }}>
                        <span style={{ color: '#aaa' }}>Ghế đang chọn:</span>
                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#fff', maxWidth: '60%', textAlign: 'right', wordBreak: 'break-word' }}>
                            {selectedSeats.map(id => {
                                const s = seats.find(x => x.seat_id === id);
                                return s ? (String.fromCharCode(64 + parseInt(s.row_index)) + s.column_index) : '';
                            }).join(', ') || 'Chưa chọn'}
                        </span>
                    </div>

                    {/* Discount Banner */}
                    {user && user.is_verified ? (
                        <div style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50', padding: '12px', borderRadius: '8px', border: '1px solid #4caf50', fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span>✓</span> <strong>Verified Member</strong>
                            </div>
                            Đã áp dụng giảm giá 10%
                        </div>
                    ) : (
                        <div style={{ backgroundColor: 'rgba(255, 152, 0, 0.1)', color: '#ff9800', padding: '12px', borderRadius: '8px', border: '1px solid #ff9800', fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span>!</span> <strong>Chưa xác thực</strong>
                            </div>
                            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/profile')}>Xác thực Email ngay</span> để được giảm 10%.
                        </div>
                    )}

                    {/* Payment Summary */}
                    <div style={{ borderTop: '1px solid #333', paddingTop: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#888' }}>
                            <span>Tạm tính</span>
                            <span>{totalPrice.toLocaleString()}đ</span>
                        </div>

                        {user && user.is_verified && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#4caf50' }}>
                                <span>Giảm giá</span>
                                <span>-{(totalPrice * 0.1).toLocaleString()}đ</span>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', alignItems: 'flex-end' }}>
                            <span style={{ fontWeight: 'bold' }}>TỔNG TIỀN</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                {user && user.is_verified
                                    ? (totalPrice * 0.9).toLocaleString()
                                    : totalPrice.toLocaleString()
                                }đ
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleBooking}
                        className="btn-primary"
                        style={{ width: '100%', padding: '15px', fontSize: '1.1rem', fontWeight: 'bold', marginTop: '10px', borderRadius: '8px' }}
                    >
                        ĐẶT VÉ NGAY
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Booking;
