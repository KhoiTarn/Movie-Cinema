import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (user && user.role && user.role.toLowerCase() === 'admin') {
        return <Outlet />;
    }

    return <Navigate to="/" />;
};

export default AdminRoute;
