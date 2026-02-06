import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [genres, setGenres] = useState([]);
    const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
    const [showCategories, setShowCategories] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        api.get('/genres').then(res => setGenres(res.data)).catch(err => console.error(err));
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (searchInput) params.set('search', searchInput);
        else params.delete('search');
        navigate('/search?' + params.toString());
    };

    const handleFilter = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value) params.set(key, value);
        else params.delete(key);
        setShowCategories(false);
        navigate('/search?' + params.toString());
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ backgroundColor: '#1a1a1a', padding: '10px 0', borderBottom: '1px solid #333', position: 'sticky', top: 0, zIndex: 1000 }}>
            <div className="container" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                {/* Logo */}
                <Link to="/" onClick={() => { setSearchInput(''); }} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <img src="/images/logo.png" alt="Khoi Cinema" style={{ height: '45px', objectFit: 'contain' }} />
                </Link>

                {/* Categories Button */}
                <div
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setShowCategories(true)}
                    onMouseLeave={() => setShowCategories(false)}
                >
                    <button style={{
                        backgroundColor: '#333',
                        color: '#fff',
                        padding: '10px 15px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.9rem',
                        border: 'none',
                        cursor: 'pointer'
                    }}>
                        ☰ Danh mục
                    </button>

                    {/* Mega Menu Dropdown */}
                    {showCategories && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            paddingTop: '10px',
                            zIndex: 1000
                        }}>
                            <div style={{
                                backgroundColor: '#1a1a1a',
                                border: '1px solid #333',
                                borderRadius: '8px',
                                padding: '25px',
                                minWidth: '450px',
                                display: 'grid',
                                gridTemplateColumns: 'minmax(150px, 1fr) 1fr',
                                gap: '40px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
                            }}>
                                <div>
                                    <h4 style={{ color: 'var(--primary-color)', marginBottom: '15px', fontSize: '1rem', borderBottom: '1px solid #333', pb: '5px' }}>Thể loại</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <span onClick={() => handleFilter('genre_id', '')} style={{ cursor: 'pointer', color: '#ccc', fontSize: '0.9rem', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#ccc'}>Tất cả</span>
                                        {genres.map(g => (
                                            <span key={g.genre_id} onClick={() => handleFilter('genre_id', g.genre_id)} style={{ cursor: 'pointer', color: '#ccc', fontSize: '0.9rem', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#ccc'}>
                                                {g.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 style={{ color: 'var(--primary-color)', marginBottom: '15px', fontSize: '1rem', borderBottom: '1px solid #333', pb: '5px' }}>Độ tuổi</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <span onClick={() => handleFilter('age_rating', '')} style={{ cursor: 'pointer', color: '#ccc', fontSize: '0.9rem', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#ccc'}>Mọi lứa tuổi</span>
                                        {['P', 'T13', 'T16', 'T18'].map(age => (
                                            <span key={age} onClick={() => handleFilter('age_rating', age)} style={{ cursor: 'pointer', color: '#ccc', fontSize: '0.9rem', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#ccc'}>
                                                {age === 'P' ? 'P - Mọi lứa tuổi' : `${age} - Trên ${age.substring(1)} tuổi`}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} style={{ flexGrow: 1, position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Bạn muốn xem phim gì hôm nay?"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 45px 10px 15px',
                            borderRadius: '25px',
                            backgroundColor: '#fff',
                            color: '#000',
                            border: 'none',
                            fontSize: '0.9rem',
                            margin: 0
                        }}
                    />
                    <button type="submit" style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', padding: 0 }}>
                        🔍
                    </button>
                </form>

                {/* Right Menu */}
                <div style={{ display: 'flex', gap: '60px', alignItems: 'center', flexShrink: 0, position: 'relative' }}>
                    <Link to="/faq" style={{ fontSize: '0.9rem', color: '#ccc', textDecoration: 'none', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#ccc'}>
                        Hỗ trợ
                    </Link>

                    {user ? (
                        <div
                            style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                            onMouseEnter={() => setShowUserMenu(true)}
                            onMouseLeave={() => setShowUserMenu(false)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '5px 0' }}>
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
                                    flexShrink: 0
                                }}>
                                    {user.avatar_url ? <img src={user.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.full_name?.charAt(0).toUpperCase()}
                                </div>
                                <span style={{ fontWeight: 500, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{user.full_name}</span>
                            </div>

                            {showUserMenu && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        paddingTop: '15px',
                                        zIndex: 1000
                                    }}
                                >
                                    <div style={{
                                        backgroundColor: '#1a1a1a',
                                        border: '1px solid #333',
                                        borderRadius: '8px',
                                        padding: '5px 0',
                                        boxShadow: '0 8px 30px rgba(0,0,0,0.8)',
                                        minWidth: '100%', // Match trigger width
                                        width: 'max-content', // Expand if items are longer
                                        overflow: 'hidden'
                                    }}>
                                        {user.role?.toLowerCase() === 'admin' && (
                                            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', color: '#ff9800', transition: '0.2s', textDecoration: 'none', fontSize: '0.9rem' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#333'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                                                ⚙️ Quản lý
                                            </Link>
                                        )}
                                        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', color: '#ccc', transition: '0.2s', textDecoration: 'none', fontSize: '0.9rem' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#333'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                                            👤 Hồ sơ
                                        </Link>
                                        <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', color: '#f44336', borderTop: '1px solid #333', cursor: 'pointer', transition: '0.2s', fontSize: '0.9rem' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#333'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                                            🚪 Đăng xuất
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="btn-primary" style={{ padding: '8px 20px', borderRadius: '25px', fontSize: '0.9rem' }}>Đăng nhập</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
