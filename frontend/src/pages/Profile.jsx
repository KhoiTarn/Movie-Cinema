import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout, loading } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('info'); // info | history

    // Edit Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ full_name: '', password: '', avatar_url: '', email: '' });

    // Verify Email State
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [otp, setOtp] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return; // Wait for auth check

        if (!user) {
            navigate('/login');
            return;
        }
        fetchProfile();
        fetchBookings();
    }, [user, loading, navigate]);

    useEffect(() => {
        if (profile) {
            setEditForm({
                full_name: profile.full_name || '',
                password: '',
                avatar_url: profile.avatar_url || '',
                email: profile.email || ''
            });
        }
    }, [profile]);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/profile');
            setProfile(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await api.get('/users/bookings');
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setEditForm({ ...editForm, avatar_url: res.data.url });
        } catch (err) {
            alert("Upload failed");
            console.error(err);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                full_name: editForm.full_name,
                avatar_url: editForm.avatar_url,
                email: editForm.email
            };
            if (editForm.password) payload.password = editForm.password;

            const res = await api.put('/users/profile', payload);
            alert(res.data.message);
            setIsEditing(false);
            fetchProfile(); // Refresh data
        } catch (err) {
            alert(err.response?.data?.message || "Update failed");
        }
    };

    const handleVerifyEmail = async () => {
        try {
            await api.post('/auth/verify-email', { email: profile.email, otp });
            alert("Email verified successfully!");
            setShowVerifyModal(false);
            fetchProfile();
        } catch (err) {
            alert(err.response?.data?.message || "Verification failed");
        }
    };

    const handleResendOtp = async () => {
        try {
            await api.post('/auth/resend-verify', { email: profile.email });
            alert("OTP sent to your email!");
            setShowVerifyModal(true); // Open modal if not open
        } catch (err) {
            alert(err.response?.data?.message || "Failed to send OTP");
        }
    };

    if (loading || !profile) return <div className="container" style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="container" style={{ padding: '0px 0 50px', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', padding: '30px', backgroundColor: '#1a1a1a', borderRadius: '12px', position: 'relative' }}>
                {/* Avatar Display */}
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', marginRight: '20px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{profile.full_name?.charAt(0).toUpperCase()}</span>
                    )}
                </div>

                <div>
                    <h2 style={{ margin: '0 0 5px', fontSize: '1.8rem' }}>{profile.full_name}</h2>
                    <p style={{ margin: 0, color: '#aaa' }}>{profile.email}</p>
                    <div style={{ marginTop: '10px' }}>
                        {profile.is_verified ? (
                            <span style={{ backgroundColor: '#4caf50', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', marginRight: '10px' }}>
                                Verified
                            </span>
                        ) : (
                            <button
                                onClick={handleResendOtp}
                                style={{ backgroundColor: '#ff9800', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', marginRight: '10px', cursor: 'pointer' }}>
                                Unverified - Click to Verify
                            </button>
                        )}
                        <span style={{ backgroundColor: '#333', color: '#ccc', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                            {profile.role}
                        </span>
                    </div>
                </div>

                <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                    <button onClick={() => setIsEditing(!isEditing)} style={{ padding: '8px 16px', backgroundColor: 'var(--primary-color)', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}>
                        {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                    </button>
                    <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#333', border: '1px solid #555', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}>
                        Đăng Xuất
                    </button>
                </div>
            </div>

            {/* Edit Form */}
            {isEditing && (
                <div style={{ padding: '20px', backgroundColor: '#1f1f1f', borderRadius: '8px', marginBottom: '30px' }}>
                    <h3 style={{ marginTop: 0 }}>Cập nhật thông tin</h3>
                    <form onSubmit={handleUpdateProfile}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Họ tên</label>
                                <input
                                    type="text"
                                    value={editForm.full_name}
                                    onChange={e => setEditForm({ ...editForm, full_name: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#000', color: '#fff' }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Email (Thay đổi sẽ cần xác thực lại)</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#000', color: '#fff' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Avatar (Upload ảnh)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#000', color: '#fff' }}
                            />
                            {editForm.avatar_url && (
                                <div style={{ marginTop: '10px' }}>
                                    <p style={{ margin: '5px 0', fontSize: '0.8rem', color: '#666' }}>Preview:</p>
                                    <img src={editForm.avatar_url} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} />
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Mật khẩu mới (Để trống nếu không đổi)</label>
                            <input
                                type="password"
                                value={editForm.password}
                                onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                                placeholder="******"
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#000', color: '#fff' }}
                            />
                        </div>
                        <button type="submit" className="btn-primary">Lưu thay đổi</button>
                    </form>
                </div>
            )}

            {/* Verify Modal */}
            {showVerifyModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#1a1a1a', padding: '30px', borderRadius: '12px', maxWidth: '400px', width: '100%' }}>
                        <h3>Xác thực Email</h3>
                        <p>Mã OTP đã được gửi đến: {profile.email}</p>
                        <input
                            type="text"
                            placeholder="Nhập 6 số OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            style={{ width: '100%', padding: '12px', fontSize: '1.2rem', textAlign: 'center', margin: '20px 0', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#000', color: '#fff' }}
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={handleVerifyEmail} className="btn-primary" style={{ flex: 1 }}>Xác nhận</button>
                            <button onClick={() => setShowVerifyModal(false)} style={{ padding: '10px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ borderBottom: '1px solid #333', marginBottom: '30px' }}>
                <button
                    onClick={() => setActiveTab('history')}
                    style={{
                        padding: '10px 20px',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'history' ? '2px solid var(--primary-color)' : 'none',
                        color: activeTab === 'history' ? 'var(--primary-color)' : '#aaa',
                        cursor: 'pointer',
                        fontSize: '1.1rem'
                    }}
                >
                    Lịch Sử Đặt Vé
                </button>
            </div>

            {activeTab === 'history' && (
                <div>
                    {bookings.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666' }}>Bạn chưa đặt vé nào.</p>
                    ) : (
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {bookings.map(booking => (
                                <div key={booking.booking_id} style={{ backgroundColor: '#1f1f1f', padding: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', borderLeft: booking.status === 'CONFIRMED' ? '4px solid #4caf50' : '4px solid #f44336' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 10px', color: '#fff' }}>{booking.movie_title}</h3>
                                        <p style={{ margin: '5px 0', color: '#aaa', fontSize: '0.9rem' }}>
                                            Rạp: <span style={{ color: '#fff' }}>{booking.cinema_name}</span> | Suất: <span style={{ color: '#fff' }}>{booking.start_time} - {booking.show_date}</span>
                                        </p>
                                        <p style={{ margin: '5px 0', color: '#aaa', fontSize: '0.9rem' }}>
                                            Ghế: <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                                                {booking.seats.map(s => s.seat_code).join(', ')}
                                            </span>
                                        </p>
                                        <p style={{ margin: '5px 0', color: '#aaa', fontSize: '0.8rem' }}>Ngày đặt: {new Date(booking.created_at).toLocaleString()}</p>
                                    </div>
                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '5px' }}>
                                            {parseFloat(booking.final_amount).toLocaleString()} đ
                                        </div>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            backgroundColor: booking.status === 'CONFIRMED' ? '#4caf5020' : '#f4433620',
                                            color: booking.status === 'CONFIRMED' ? '#4caf50' : '#f44336',
                                            textAlign: 'center'
                                        }}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Profile;
