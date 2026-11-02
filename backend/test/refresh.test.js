import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from './helpers.js';

let api;
before(async () => { api = await startServer(); });
after(() => api.close());

const login = async () =>
  (await api.request('/auth/login', { body: { email: 'field@dpercp.test', password: 'ChangeMe123!' } })).json();

test('refresh gives a new pair and the old refresh token stops working', async () => {
  const first = await login();
  const res = await api.request('/auth/refresh', { body: { refreshToken: first.refreshToken } });
  const second = await res.json();
  assert.equal(res.status, 200);
  assert.notEqual(second.refreshToken, first.refreshToken);
  assert.equal((await api.request('/auth/me', { token: second.accessToken })).status, 200);
  const replay = await api.request('/auth/refresh', { body: { refreshToken: first.refreshToken } });
  assert.equal(replay.status, 401);
});

test('logout revokes the refresh token', async () => {
  const { refreshToken } = await login();
  assert.equal((await api.request('/auth/logout', { body: { refreshToken } })).status, 204);
  assert.equal((await api.request('/auth/refresh', { body: { refreshToken } })).status, 401);
});

test('an unknown refresh token is a 401', async () => {
  assert.equal((await api.request('/auth/refresh', { body: { refreshToken: 'made-up' } })).status, 401);
});
