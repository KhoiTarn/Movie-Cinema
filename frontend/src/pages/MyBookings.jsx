import React, { useEffect, useState } from 'react';
import api from '../services/api';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        api.get('/bookings/my-bookings')
            .then(res => setBookings(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <h2 style={{ marginBottom: '30px' }}>Vé Của Tôi</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {bookings.length > 0 ? bookings.map(booking => (
                    <div key={booking.booking_id} className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{booking.showtime.movie.title}</h3>
                            <p style={{ color: '#aaa', marginBottom: '5px' }}>
                                {booking.showtime.room.cinema.name} - {booking.showtime.room.name}
                            </p>
                            <p style={{ color: 'var(--primary-color)' }}>
                                {new Date(booking.showtime.start_time).toLocaleString()}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '5px' }}>{parseInt(booking.final_amount).toLocaleString()}đ</div>
                            <span style={{ backgroundColor: 'green', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{booking.status}</span>
                        </div>
                    </div>
                )) : <p>Bạn chưa có lịch sử đặt vé.</p>}
            </div>
        </div>
    );
};

export default MyBookings;
