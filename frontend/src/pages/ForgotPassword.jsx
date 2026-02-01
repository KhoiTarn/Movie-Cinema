import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/forgot-password', { email });
            setStep(2);
            setMessage("Mã OTP đã được gửi đến email của bạn.");
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi gửi OTP");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/reset-password', { email, otp, newPassword });
            alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi đổi mật khẩu (Sai OTP hoặc hết hạn)");
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at 20% 40%, #500000, #000000 60%)',
            color: '#fff'
        }}>
            <div className="container" style={{ maxWidth: '400px', width: '100%', padding: '40px', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '12px', border: '1px solid #333' }}>
                <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Quên Mật Khẩu</h2>

                {message && <div style={{ color: 'green', marginBottom: '10px', textAlign: 'center' }}>{message}</div>}
                {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}

                {step === 1 && (
                    <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <p style={{ marginBottom: '0', color: '#aaa', fontSize: '0.9rem', textAlign: 'center' }}>Nhập email để nhận mã OTP xác thực.</p>
                        <input type="email" placeholder="Email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '12px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontWeight: 'bold' }}>Gửi OTP</button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <p style={{ marginBottom: '0', color: '#aaa', fontSize: '0.9rem', textAlign: 'center' }}>Nhập mã OTP và mật khẩu mới.</p>
                        <input type="text" placeholder="Mã OTP (6 số)" value={otp} onChange={(e) => setOtp(e.target.value)} required style={{ padding: '12px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                        <input type="password" placeholder="Mật khẩu mới" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={{ padding: '12px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontWeight: 'bold' }}>Đổi Mật Khẩu</button>
                        <button type="button" className="btn-secondary" style={{ width: '100%', marginTop: '5px' }} onClick={() => setStep(1)}>Quay lại</button>
                    </form>
                )}

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#aaa' }}>
                    <Link to="/login" style={{ color: '#aaa', textDecoration: 'underline' }}>Quay lại Đăng nhập</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
