import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { logout } from '../../api/auth.js';

export default function LogoutButton()
{
    const navigate = useNavigate();
    const busy = useRef(false);

    const [pending, setPending] = useState(false);
    const [error, setError] = useState('');

    async function handleLogout()
    {
        if (busy.current)
        {
            return;
        }

        busy.current = true;
        setPending(true);
        setError('');

        try
        {
            await logout();
            navigate('/login', { replace: true });
        }
        catch
        {
            setError('Unable to sign out. Please try again.');
        }
        finally
        {
            busy.current = false;
            setPending(false);
        }
    }

    return (
        <div className="flex flex-col items-end gap-2">
            <button
                type="button"
                onClick={handleLogout}
                disabled={pending}
                className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#203d63] transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#203d63] disabled:cursor-wait disabled:opacity-60"
            >
                <LogOut size={17} aria-hidden="true" />
                {pending ? 'Signing out…' : 'Sign out'}
            </button>

            {error && (
                <p role="alert" className="text-sm text-red-700">
                    {error}
                </p>
            )}
        </div>
    );
}