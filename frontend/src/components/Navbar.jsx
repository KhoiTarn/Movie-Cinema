import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ backgroundColor: 'rgba(0,0,0,0.9)', padding: '15px 0', borderBottom: '1px solid #333', position: 'sticky', top: 0, zIndex: 100 }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    Khoi CINEMA
                </Link>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <Link to="/">Phim Đang Chiếu</Link>
                    {user ? (
                        <>
                            <Link to="/my-bookings">Vé Của Tôi</Link>
                            <span>Xin chào, {user.full_name}</span>
                            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '5px 10px' }}>Đăng xuất</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Đăng nhập</Link>
                            <Link to="/register" className="btn-primary" style={{ padding: '5px 15px', borderRadius: '4px' }}>Đăng ký</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
