import app from '../app.js';

export async function startServer() {
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = (path, { token, body, method } = {}) =>
    fetch(base + path, {
      method: method || (body ? 'POST' : 'GET'),
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  return { request, close: () => server.close() };
}
