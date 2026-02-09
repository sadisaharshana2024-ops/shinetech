import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../security/auth';

const ProtectedRoute = ({ redirectPath = '/login' }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--background)' }}>
                <div className="neon-text" style={{ fontSize: '1.5rem', fontWeight: '800' }}>SECURE LOADING...</div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
