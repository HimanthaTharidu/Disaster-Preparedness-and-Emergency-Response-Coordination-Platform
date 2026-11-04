import React, { useRef, useState } from 'react';
import { AuthError, previewMode, register, signIn } from '../../api/auth.js';
import { dictionaries } from '../../locales.js';


export default function AuthForm({ screen, language, onLanguageChange })
{
    const text = dictionaries[language];
    const isRegister = screen === 'register';
    const [values, setValues] = useState({ name: '', identifier: '', email: '', phone: '', password: '', confirm: '' });
    const [errors, setErrors] = useState({});
    const [visible, setVisible] = useState(false);
    const [pending, setPending] = useState(false);
    const [notice, setNotice] = useState(null);
    const busy = useRef(false);
    const statusRef = useRef(null);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?\d{9,15}$/;
    const cleanPhone = (value) => value.replace(/[\s()-]/g, '');

    function change(field, value)
    {
        setValues(current => ({ ...current, [field]: value }));
        setErrors(current => ({ ...current, [field]: undefined, ...(field === 'password' ? { confirm: undefined } : {}) }));
        setNotice(null);
    }

    function validate()
    {
        const next = {};
        if (isRegister)
        {
            if (!values.name.trim()) next.name = 'required';
            if (!values.email.trim()) next.email = 'required';
            else if (!emailPattern.test(values.email.trim())) next.email = 'invalidEmail';
            if (!values.phone.trim()) next.phone = 'required';
            else if (!phonePattern.test(cleanPhone(values.phone))) next.phone = 'invalidPhone';
            if (!values.password) next.password = 'required';
            else if (values.password.length < 8) next.password = 'shortPassword';
            if (!values.confirm) next.confirm = 'required';
            else if (values.confirm !== values.password) next.confirm = 'mismatch';
        }
        else
        {
            if (!values.identifier.trim()) next.identifier = 'required';
            else if (!emailPattern.test(values.identifier.trim()) && !phonePattern.test(cleanPhone(values.identifier)))
                next.identifier = 'invalidIdentifier';
            if (!values.password) next.password = 'required';
        }
        return next;
    }

    async function submit(event)
    {
        event.preventDefault();
        if (busy.current) return;
        setNotice(null);
        const next = validate();
        setErrors(next);
        const first = Object.keys(next)[0];
        if (first)
        {
            document.getElementById(first)?.focus();
            return;
        }
        busy.current = true;
        setPending(true);
        try
        {
            const result = isRegister
                ? await register({ full_name: values.name.trim(), email: values.email.trim(), phone: cleanPhone(values.phone), password: values.password, preferred_language: language })
                : await signIn({ identifier: values.identifier.includes('@') ? values.identifier.trim() : cleanPhone(values.identifier), password: values.password, preferred_language: language });
            setNotice({ key: result === 'preview' ? 'previewSuccess' : isRegister ? 'registerSuccess' : 'loginSuccess', error: false });
            if (result !== 'preview')
            {
                setValues(current => ({ ...current, password: '', confirm: '' }));
                setVisible(false);
            }
        }
        catch (error)
        {
            setNotice({ key: error instanceof AuthError ? error.code : 'server', error: true });
        }
        finally
        {
            busy.current = false;
            setPending(false);
            window.setTimeout(() => statusRef.current?.focus(), 0);
        }
    }

    function field(name, label, placeholder, type = 'text', autoComplete = '')
    {
        const passwordField = name === 'password' || name === 'confirm';
        const error = errors[name];
        const hint = name === 'password' && isRegister;
        const descriptions = [error ? `${name}-error` : '', hint ? 'password-hint' : ''].filter(Boolean).join(' ') || undefined;
        return (
            <div className="field" key={name}>
                <label htmlFor={name}>{label}</label>
                <div className="input-wrap">
                    <input
                        id={name}
                        name={name}
                        type={passwordField ? visible ? 'text' : 'password' : type}
                        value={values[name]}
                        onChange={event => change(name, event.target.value)}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        aria-invalid={Boolean(error)}
                        aria-describedby={descriptions}
                        required
                        maxLength={passwordField ? 128 : name === 'name' ? 120 : name === 'phone' ? 24 : 254}
                        inputMode={name === 'phone' ? 'tel' : name === 'email' ? 'email' : undefined}
                        className={passwordField && name === 'password' ? 'password-input' : undefined}
                    />
                    {name === 'password' && (
                        <button type="button" className="password-toggle" onClick={() => setVisible(current => !current)} aria-label={visible ? text.hide : text.show} aria-pressed={visible}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                                <circle cx="12" cy="12" r="3" />
                                {visible && <path d="m3 3 18 18" />}
                            </svg>
                        </button>
                    )}
                </div>
                {hint && <p className="hint" id="password-hint">{text.passwordHint}</p>}
                {error && <p className="field-error" id={`${name}-error`}>{text[error]}</p>}
            </div>
        );
    }

    return (
        <main className="auth-page">
            <section className={`auth-card ${isRegister ? 'registration-card' : 'login-card'}`} aria-labelledby="brand-heading">
                <header>
                    <h1 id="brand-heading">DPERCP</h1>
                    <p className="subtitle">{isRegister ? text.registerTitle : text.signInTitle}</p>
                </header>

                <form onSubmit={submit} noValidate aria-busy={pending}>
                    <fieldset disabled={pending}>
                        <div className="fields">
                            {isRegister ? <>
                                {field('name', text.name, text.namePlaceholder, 'text', 'name')}
                                {field('email', text.email, text.identifierPlaceholder, 'email', 'email')}
                                {field('phone', text.phone, text.phonePlaceholder, 'tel', 'tel')}
                            </> : field('identifier', text.identifier, text.identifierPlaceholder, 'text', 'username')}
                            {field('password', text.password, text.passwordPlaceholder, 'password', isRegister ? 'new-password' : 'current-password')}
                            {isRegister && field('confirm', text.confirm, text.confirmPlaceholder, 'password', 'new-password')}
                        </div>
                        {isRegister && <p className="approval-note">{text.reviewNote}</p>}
                        <button className="submit-button" type="submit">
                            {pending ? text.wait : isRegister ? text.requestAccount : text.signIn}
                        </button>
                        <div className="field language-field">
                            <label htmlFor="language">{text.language}</label>
                            <select id="language" value={language} onChange={event => onLanguageChange(event.target.value)}>
                                <option value="en">English</option>
                                <option value="si">සිංහල</option>
                                <option value="ta">தமிழ்</option>
                            </select>
                        </div>
                    </fieldset>
                </form>

                {notice && <div ref={statusRef} tabIndex={-1} className={`notice ${notice.error ? 'notice-error' : ''}`} role={notice.error ? 'alert' : 'status'}>{text[notice.key]}</div>}
                <p className="switch-page">
                    {isRegister ? text.existingAccount : text.newAccount}{' '}
                    <a href={isRegister ? '#/login' : '#/register'} onClick={event => { if (pending) event.preventDefault(); }} aria-disabled={pending}>
                        {isRegister ? text.signIn : text.registerLink}
                    </a>
                </p>
                {previewMode && <p className="preview-badge">{text.previewBadge}</p>}
            </section>
        </main>
    );
}
