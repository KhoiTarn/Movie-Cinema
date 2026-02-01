import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const result = await googleLogin(credentialResponse.credential);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
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
                <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Đăng Nhập</h2>
                {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '12px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                    <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '12px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontWeight: 'bold' }}>Đăng Nhập</button>
                </form>

                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Link to="/forgot-password" style={{ color: '#aaa', fontSize: '0.9rem', textDecoration: 'none' }}>Quên mật khẩu?</Link>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => {
                            console.log('Login Failed');
                            setError("Google Login Failed");
                        }}
                        useOneTap
                        theme="filled_black"
                    />
                </div>
                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#aaa' }}>
                    Chưa có tài khoản? <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Đăng ký ngay</Link>
                </div>
            </div>
        </div>
    );
};

export const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(name, email, password);
        if (result.success) {
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            navigate('/login');
        } else {
            setError(result.message);
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
                <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Đăng Ký Thành Viên</h2>
                {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input type="text" placeholder="Họ tên" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '12px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '12px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                    <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '12px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontWeight: 'bold' }}>Đăng Ký</button>
                </form>
                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#aaa' }}>
                    Đã có tài khoản? <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Đăng nhập</Link>
                </div>
            </div>
        </div>
    );
};
