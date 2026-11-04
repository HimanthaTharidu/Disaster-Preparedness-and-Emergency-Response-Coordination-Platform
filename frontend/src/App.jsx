import React, { useEffect, useState } from 'react';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import { dictionaries } from './locales.js';

function currentScreen()
{
    const hash = window.location.hash;

    return hash === '#/signup' || hash === '#/register'
        ? 'signup'
        : 'login';
}

export default function App()
{
    const [screen, setScreen] = useState(currentScreen);
    const [language, setLanguage] = useState('en');

    useEffect(() =>
    {
        function updateScreen()
        {
            setScreen(currentScreen());
        }

        window.addEventListener('hashchange', updateScreen);

        return () =>
        {
            window.removeEventListener('hashchange', updateScreen);
        };
    }, []);

    useEffect(() =>
    {
        document.documentElement.lang = language;

        document.title = `DPERCP | ${
            screen === 'login'
                ? dictionaries[language].signIn
                : dictionaries[language].registerLink
        }`;
    }, [screen, language]);

    return screen === 'signup'
    ? (
        <Register
            language={language}
            onLanguageChange={setLanguage}
        />
    )
    : (
        <Login
            language={language}
            onLanguageChange={setLanguage}
        />
    );
}