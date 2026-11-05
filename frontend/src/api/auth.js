export class AuthError extends Error
{
    constructor(code)
    {
        super(code);
        this.code = code;
        this.name = 'AuthError';
    }
}

export const previewMode = import.meta.env.VITE_AUTH_MODE !== 'api';

const baseUrl = (
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
).replace(/\/+$/, '');

let session = null;

export function getAccessToken()
{
    return session?.accessToken || null;
}

export function getCurrentUser()
{
    return session?.user || null;
}

export function clearSession()
{
    session = null;
}

async function post(path, input)
{
    const controller = new AbortController();

    const timer = window.setTimeout(() =>
    {
        controller.abort();
    }, 15000);

    try
    {
        const response = await fetch(`${baseUrl}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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

            if (response.status === 400 || response.status === 422)
            {
                throw new AuthError('validation');
            }

            throw new AuthError('server');
        }

        const data = await response.json();

        if (
            !data ||
            typeof data.accessToken !== 'string' ||
            typeof data.refreshToken !== 'string' ||
            !data.user
        )
        {
            throw new AuthError('server');
        }

        return data;
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

export async function signIn(input)
{
    if (previewMode)
    {
        return 'preview';
    }

    const data = await post('/auth/login', {
        email: input.identifier.trim(),
        password: input.password
    });

    session = data;

    return data;
}

export async function register(input)
{
    if (previewMode)
    {
        return 'preview';
    }

    const phoneNumber = input.phone?.trim();

    return post('/auth/register', {
        name: input.full_name.trim(),
        email: input.email.trim(),
        password: input.password,
        ...(phoneNumber ? { phoneNumber } : {})
    });
}

export async function logout()
{
    const refreshToken = session?.refreshToken;

    if (!refreshToken)
    {
        clearSession();
        return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(() =>
    {
        controller.abort();
    }, 15000);

    try
    {
        const response = await fetch(`${baseUrl}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken }),
            signal: controller.signal
        });

        if (!response.ok && response.status !== 401)
        {
            throw new AuthError('server');
        }

        clearSession();
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