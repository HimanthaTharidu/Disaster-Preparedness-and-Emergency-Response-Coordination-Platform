import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAccessToken } from '../../api/auth.js';

export default function ProtectedRoute()
{
    const location = useLocation();

    if (!getAccessToken())
    {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return <Outlet />;
}