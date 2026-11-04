export type Language = 'en' | 'si' | 'ta';

export interface LoginInput
{
    identifier: string;
    password: string;
    preferred_language: Language;
}

export interface RegisterInput
{
    full_name: string;
    email: string;
    phone: string;
    password: string;
    preferred_language: Language;
}

export class AuthError extends Error
{
    constructor(public code: 'network' | 'invalid' | 'duplicate' | 'server' | 'timeout')
    {
        super(code);
    }
}

export const previewMode = import.meta.env.VITE_AUTH_MODE !== 'api';
const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1').replace(/\/$/, '');

async function post(path: string, input: LoginInput | RegisterInput): Promise<void>
{
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15000);

    try
    {
        const response = await fetch(`${baseUrl}${path}`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
            signal: controller.signal
        });

        if (!response.ok)
        {
            if (response.status === 401 || response.status === 403)
            {
                throw new AuthError('invalid');
            }
            if (response.status === 409)
            {
                throw new AuthError('duplicate');
            }
            throw new AuthError('server');
        }
    }
    catch (error)
    {
        if (error instanceof AuthError)
        {
            throw error;
        }
        if (error instanceof DOMException && error.name === 'AbortError')
        {
            throw new AuthError('timeout');
        }
        throw new AuthError('network');
    }
    finally
    {
        window.clearTimeout(timer);
    }
}

export async function signIn(input: LoginInput): Promise<'preview' | 'submitted'>
{
    if (previewMode)
    {
        return 'preview';
    }
    await post('/auth/login', input);
    return 'submitted';
}

export async function register(input: RegisterInput): Promise<'preview' | 'submitted'>
{
    if (previewMode)
    {
        return 'preview';
    }
    await post('/auth/register', input);
    return 'submitted';
}
