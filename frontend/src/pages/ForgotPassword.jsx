import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Quên Mật Khẩu</h2>

            {message && <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            {step === 1 && (
                <form onSubmit={handleSendOtp}>
                    <p style={{ marginBottom: '10px', color: '#aaa' }}>Nhập email để nhận mã OTP xác thực.</p>
                    <input type="email" placeholder="Email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Gửi OTP</button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleResetPassword}>
                    <p style={{ marginBottom: '10px', color: '#aaa' }}>Nhập mã OTP và mật khẩu mới.</p>
                    <input type="text" placeholder="Mã OTP (6 số)" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                    <input type="password" placeholder="Mật khẩu mới" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Đổi Mật Khẩu</button>
                    <button type="button" className="btn-secondary" style={{ width: '100%', marginTop: '10px' }} onClick={() => setStep(1)}>Quay lại</button>
                </form>
            )}
        </div>
    );
};

export default ForgotPassword;
