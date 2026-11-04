import React from 'react';
import AuthForm from '../../components/auth/AuthForm.jsx';

export default function LoginPage({ language, onLanguageChange })
{
    return (
        <AuthForm
            screen="login"
            language={language}
            onLanguageChange={onLanguageChange}
        />
    );
}