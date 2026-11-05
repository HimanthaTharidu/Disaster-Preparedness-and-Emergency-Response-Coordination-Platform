import React, { useEffect, useState } from 'react';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';

function currentPage()
{
    const hash = window.location.hash;

    return hash === '#/register' || hash === '#/signup'
        ? 'register'
        : 'login';
}

export default function App()
{
    const [page, setPage] = useState(currentPage);

    useEffect(() =>
    {
        function updatePage()
        {
            setPage(currentPage());
        }

        window.addEventListener('hashchange', updatePage);

        return () =>
        {
            window.removeEventListener('hashchange', updatePage);
        };
    }, []);

    useEffect(() =>
    {
        document.documentElement.lang = 'en';

        document.title = page === 'register'
            ? 'DPERCP | Register'
            : 'DPERCP | Sign in';
    }, [page]);

    return page === 'register'
        ? <Register />
        : <Login />;
}