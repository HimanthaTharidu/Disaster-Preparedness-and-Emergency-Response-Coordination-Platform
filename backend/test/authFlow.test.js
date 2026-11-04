import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from './helpers.js';

let api;
before(async () => { api = await startServer(); });
after(() => api.close());

test('an operator signs in, works, refreshes and signs out', async () => {
  const login = await (await api.request('/auth/login', {
    body: { email: 'operator@dpercp.test', password: 'ChangeMe123!' },
  })).json();

  assert.equal((await api.request('/auth/me', { token: login.accessToken })).status, 200);
  assert.equal((await api.request('/incidents', { token: login.accessToken })).status, 200);

  const renewed = await (await api.request('/auth/refresh', { body: { refreshToken: login.refreshToken } })).json();
  assert.equal((await api.request('/shelters', { token: renewed.accessToken })).status, 200);

  await api.request('/auth/logout', { body: { refreshToken: renewed.refreshToken } });
  assert.equal((await api.request('/auth/refresh', { body: { refreshToken: renewed.refreshToken } })).status, 401);
});

test('a field user is signed in but kept out of operator routes', async () => {
  const { accessToken } = await (await api.request('/auth/login', {
    body: { email: 'field@dpercp.test', password: 'ChangeMe123!' },
  })).json();
  assert.equal((await api.request('/auth/me', { token: accessToken })).status, 200);
  assert.equal((await api.request('/incidents', { token: accessToken })).status, 403);
});
