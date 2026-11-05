import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    AuthError,
    register,
    signIn
} from '../../api/auth.js';

const inputClasses =
    'block min-h-12 w-full rounded-[10px] border bg-white px-4 py-3 ' +
    'text-base text-slate-900 placeholder:text-slate-500 ' +
    'outline-none transition focus:border-[#476a97] ' +
    'focus:ring-4 focus:ring-[#203d63]/10 ' +
    'disabled:cursor-wait sm:text-lg';

const requestErrors = {
    network: 'Unable to connect. Please check your connection and try again.',
    invalid: 'Invalid email or password, or access was denied.',
    duplicate: 'An account with those details already exists.',
    server: 'The request could not be completed. Please try again.',
    timeout: 'The request timed out. Please try again.',
    validation: 'Please check your details and try again.'
};

function InputField({
    name,
    label,
    placeholder,
    type = 'text',
    autoComplete,
    value,
    error,
    hint,
    onChange,
    canToggle = false,
    visible = false,
    onToggle
})
{
    const isPassword = name === 'password' || name === 'confirm';

    const describedBy = [
        error ? `${name}-error` : '',
        hint ? `${name}-hint` : ''
    ].filter(Boolean).join(' ') || undefined;

    return (
        <div>
            <label
                htmlFor={name}
                className="mb-1.5 block text-[15px] font-medium text-slate-900"
            >
                {label}
            </label>

            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={isPassword ? visible ? 'text' : 'password' : type}
                    value={value}
                    onChange={event => onChange(name, event.target.value)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    inputMode={
                        name === 'phone'
                            ? 'tel'
                            : name === 'email'
                                ? 'email'
                                : undefined
                    }
                    maxLength={isPassword ? 128 : name === 'phone' ? 24 : 254}
                    required
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy}
                    className={[
                        inputClasses,
                        error ? 'border-red-600' : 'border-[#d7e1ee]',
                        canToggle ? 'pr-14' : ''
                    ].join(' ')}
                />

                {canToggle && (
                    <button
                        type="button"
                        onClick={onToggle}
                        aria-label={visible ? 'Hide password' : 'Show password'}
                        aria-pressed={visible}
                        className="absolute top-1/2 right-1 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#203d63]"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            className="size-5"
                            aria-hidden="true"
                        >
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                            <circle cx="12" cy="12" r="3" />
                            {visible && <path d="m3 3 18 18" />}
                        </svg>
                    </button>
                )}
            </div>

            {hint && (
                <p
                    id={`${name}-hint`}
                    className="mt-1.5 text-sm leading-6 text-slate-500"
                >
                    {hint}
                </p>
            )}

            {error && (
                <p
                    id={`${name}-error`}
                    className="mt-1.5 text-sm leading-6 text-red-700"
                >
                    {error}
                </p>
            )}
        </div>
    );
}

export default function AuthForm({ screen })
{
    const isRegister = screen === 'register';
    const navigate = useNavigate();

    const [values, setValues] = useState({
        name: '',
        identifier: '',
        email: '',
        phone: '',
        password: '',
        confirm: ''
    });

    const [errors, setErrors] = useState({});
    const [visible, setVisible] = useState(false);
    const [pending, setPending] = useState(false);
    const [notice, setNotice] = useState(null);

    const busy = useRef(false);
    const statusRef = useRef(null);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?\d{9,15}$/;

    function cleanPhone(value)
    {
        return value.replace(/[\s()-]/g, '');
    }

    function change(name, value)
    {
        setValues(current => ({
            ...current,
            [name]: value
        }));

        setErrors(current => ({
            ...current,
            [name]: undefined,
            ...(name === 'password' ? { confirm: undefined } : {})
        }));

        setNotice(null);
    }

    function validate()
    {
        const next = {};

        if (isRegister)
        {
            if (!values.name.trim())
            {
                next.name = 'Enter your full name.';
            }

            if (!emailPattern.test(values.email.trim()))
            {
                next.identifier = 'Enter a valid email address.';
            }

            if (!phonePattern.test(cleanPhone(values.phone)))
            {
                next.phone = 'Enter a valid phone number.';
            }

            if (values.password.length < 8)
            {
                next.password = 'Use at least 8 characters.';
            }

            if (!values.confirm)
            {
                next.confirm = 'Confirm your password.';
            }
            else if (values.confirm !== values.password)
            {
                next.confirm = 'The passwords do not match.';
            }
        }
        else
{
    const identifier = values.identifier.trim();

    if (!emailPattern.test(identifier))
    {
        next.identifier = 'Enter a valid email address.';
    }

    if (!values.password)
    {
        next.password = 'Enter your password.';
    }
}

return next;
    }

async function submit(event)
{
    event.preventDefault();

    if (busy.current)
    {
        return;
    }

    setNotice(null);

    const next = validate();
    setErrors(next);

    const firstError = Object.keys(next)[0];

    if (firstError)
    {
        document.getElementById(firstError)?.focus();
        return;
    }

    busy.current = true;
    setPending(true);

    try
    {
        let result;

        if (isRegister)
        {
            result = await register({
                full_name: values.name.trim(),
                email: values.email.trim(),
                phone: cleanPhone(values.phone),
                password: values.password,
                preferred_language: 'en'
            });
        }
        else
        {
            result = await signIn({
                identifier: values.identifier.trim(),
                password: values.password,
                preferred_language: 'en'
            });
        }

        if (result === 'preview')
        {
            setNotice({
                error: false,
                message: 'Form validated. Preview mode is still enabled.'
            });

            return;
        }

        setValues(current => ({
            ...current,
            password: '',
            confirm: ''
        }));

        setVisible(false);

        if (isRegister)
        {
            setNotice({
                error: false,
                message: 'Account created successfully. You can now sign in.'
            });
        }
        else
        {
            navigate('/', { replace: true });
        }
    }
    catch (error)
    {
        setNotice({
            error: true,
            message: error instanceof AuthError
                ? requestErrors[error.code] || requestErrors.server
                : requestErrors.server
        });
    }
    finally
    {
        busy.current = false;
        setPending(false);

        window.setTimeout(() =>
        {
            statusRef.current?.focus();
        }, 0);
    }
}

    const fields = isRegister
        ? [
            {
                name: 'name',
                label: 'Full name',
                placeholder: 'Enter your full name',
                autoComplete: 'name'
            },
            {
                name: 'email',
                label: 'Email address',
                placeholder: 'name@dmc.gov.lk',
                type: 'email',
                autoComplete: 'email'
            },
            {
                name: 'phone',
                label: 'Phone number',
                placeholder: '077 123 4567',
                type: 'tel',
                autoComplete: 'tel'
            },
            {
                name: 'password',
                label: 'Password',
                placeholder: 'Enter password',
                autoComplete: 'new-password',
                hint: 'Use at least 8 characters.'
            },
            {
                name: 'confirm',
                label: 'Confirm password',
                placeholder: 'Re-enter password',
                autoComplete: 'new-password'
            }
        ]
        : [
            {
               name: 'identifier',
               label: 'Email address',
               placeholder: 'name@dmc.gov.lk',
               type: 'email',
               autoComplete: 'username'
            },
            {
                name: 'password',
                label: 'Password',
                placeholder: 'Enter password',
                autoComplete: 'current-password'
            }
        ];

    return (
        <main className="flex min-h-screen min-h-svh items-center justify-center bg-[#f7f9fb] px-4 py-8 font-sans text-slate-900 sm:px-6 sm:py-12">
            <section
                aria-labelledby="auth-heading"
                className="w-full max-w-[500px] rounded-2xl border border-[#d7e1ee] bg-white p-5 sm:p-6"
            >
                <header>
                    <h1
                        id="auth-heading"
                        className="text-[30px] leading-tight font-semibold tracking-tight text-[#203d63]"
                    >
                        DPERCP
                    </h1>

                    <p className="mt-5 text-base leading-7 text-[#4b5d78] sm:text-lg">
                        {isRegister
                            ? 'Create a DMC field account.'
                            : 'Sign in with your DMC account. Staff only.'}
                    </p>
                </header>

                <form
                    onSubmit={submit}
                    noValidate
                    aria-busy={pending}
                    className="mt-5"
                >
                    <fieldset
                        disabled={pending}
                        className="min-w-0 border-0 p-0 disabled:opacity-60"
                    >
                        <div
                            className={
                                isRegister
                                    ? 'grid gap-5'
                                    : 'grid gap-8 sm:gap-11'
                            }
                        >
                            {fields.map(field => (
                                <InputField
                                    key={field.name}
                                    {...field}
                                    value={values[field.name]}
                                    error={errors[field.name]}
                                    onChange={change}
                                    canToggle={field.name === 'password'}
                                    visible={visible}
                                    onToggle={() => setVisible(current => !current)}
                                />
                            ))}
                        </div>


                        <button
                            type="submit"
                            className={[
                                'flex min-h-12 w-full cursor-pointer items-center',
                                'justify-center rounded-[10px] bg-[#203d63]',
                                'px-4 py-3 text-lg font-semibold text-white',
                                'transition hover:bg-[#162f50]',
                                'focus-visible:outline-2 focus-visible:outline-offset-4',
                                'focus-visible:outline-[#203d63]',
                                'disabled:cursor-wait motion-reduce:transition-none',
                                isRegister ? 'mt-6' : 'mt-9 sm:mt-11'
                            ].join(' ')}
                        >
                            {pending
                                ? 'Please wait…'
                                : isRegister
                                    ? 'Create a account'
                                    : 'Sign in'}
                        </button>
                    </fieldset>
                </form>

                {notice && (
                    <div
                        ref={statusRef}
                        tabIndex={-1}
                        role={notice.error ? 'alert' : 'status'}
                        className={[
                            'mt-5 rounded-lg border p-3 text-sm leading-6',
                            'break-words focus:outline-none',
                            notice.error
                                ? 'border-red-200 bg-red-50 text-red-800'
                                : 'border-emerald-200 bg-emerald-50 text-emerald-900'
                        ].join(' ')}
                    >
                        {notice.message}
                    </div>
                )}

                <p className="mt-6 text-center text-sm leading-6 text-[#4b5d78]">
                    {isRegister
                        ? 'Already have an account?'
                        : 'Need an account?'}{' '}

                    <Link
                        to={isRegister ? '/login' : '/register'}
                        aria-disabled={pending}
                        onClick={event => {
                            if (pending)
                            {
                                event.preventDefault();
                            }
                        }}
                        className="rounded-sm font-semibold text-[#203d63] underline underline-offset-4 hover:text-[#162f50] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#203d63]"
                    >
                        {isRegister ? 'Sign in' : 'Register'}
                    </Link>
                </p>
            </section>
        </main>
    );
}