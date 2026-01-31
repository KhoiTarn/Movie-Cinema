import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalMovies: 0,
        totalBookings: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/stats');
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div style={{ padding: '20px', color: '#fff' }}>
            <h1 style={{ marginBottom: '30px' }}>Admin Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
                    <h3 style={{ color: '#888', marginTop: 0 }}>Tổng Phim</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{stats.totalMovies}</p>
                </div>
                <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
                    <h3 style={{ color: '#888', marginTop: 0 }}>Tổng Vé Bán</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{stats.totalBookings}</p>
                </div>
                <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
                    <h3 style={{ color: '#888', marginTop: 0 }}>Doanh Thu</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>
                        {stats.totalRevenue.toLocaleString()} VNĐ
                    </p>
                </div>
            </div>

            <div style={{ marginTop: '50px' }}>
                <h2>Quản lý nhanh</h2>
                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                    <Link to="/admin/movies" style={{ padding: '10px 20px', backgroundColor: 'var(--primary-color)', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', textDecoration: 'none' }}>
                        + Quản lý Phim
                    </Link>
                    <Link to="/admin/showtimes" style={{ padding: '10px 20px', backgroundColor: '#333', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', textDecoration: 'none' }}>
                        📅 Quản lý Lịch Chiếu
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
