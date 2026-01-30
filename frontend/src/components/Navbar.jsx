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
                        <div
                            style={{ position: 'relative', cursor: 'pointer' }}
                            onMouseEnter={() => document.getElementById('user-dropdown').style.display = 'block'}
                            onMouseLeave={() => document.getElementById('user-dropdown').style.display = 'none'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    width: '35px',
                                    height: '35px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--primary-color)',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    color: '#fff',
                                    border: '2px solid transparent'
                                }}>
                                    {user.avatar_url ? (
                                        <img src={user.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        user.full_name?.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <span style={{ fontWeight: 500 }}>{user.full_name}</span>
                                <span style={{ fontSize: '0.8rem', color: '#888' }}>▼</span>
                            </div>

                            {/* Dropdown Menu */}
                            {/* Dropdown Menu */}
                            <div
                                id="user-dropdown"
                                style={{
                                    display: 'none',
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    paddingTop: '10px', // Transparent bridge
                                    zIndex: 1000,
                                }}
                            >
                                <div style={{
                                    backgroundColor: '#1a1a1a',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    padding: '10px 0',
                                    minWidth: '200px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                                }}>
                                    <div style={{ padding: '10px 20px', borderBottom: '1px solid #333', marginBottom: '5px' }}>
                                        <p style={{ margin: 0, fontWeight: 'bold', color: '#fff' }}>{user.full_name}</p>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#aaa' }}>{user.email}</p>
                                    </div>

                                    <Link to="/profile" style={{ display: 'block', padding: '10px 20px', color: '#ccc', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.style.background = '#333'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                                        🎫 Vé của tôi
                                    </Link>
                                    <Link to="/profile" style={{ display: 'block', padding: '10px 20px', color: '#ccc', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.style.background = '#333'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                                        👤 Thông tin cá nhân
                                    </Link>
                                    <div
                                        onClick={handleLogout}
                                        style={{ padding: '10px 20px', color: '#f44336', cursor: 'pointer', transition: 'background 0.2s' }}
                                        onMouseEnter={(e) => e.target.style.background = '#333'}
                                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                    >
                                        🚪 Đăng xuất
                                    </div>
                                </div>
                            </div>
                        </div>
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
