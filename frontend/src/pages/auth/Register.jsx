import React from 'react';
import AuthForm from '../../components/auth/AuthForm.jsx';

export default function Register({ language, onLanguageChange })
{
    return (
        <AuthForm
            screen="register"
            language={language}
            onLanguageChange={onLanguageChange}
        />
    );
}