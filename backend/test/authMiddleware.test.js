import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { startServer } from './helpers.js';

let api;
before(async () => { api = await startServer(); });
after(() => api.close());

const login = async (email) => {
  const res = await api.request('/auth/login', { body: { email, password: 'ChangeMe123!' } });
  return (await res.json()).accessToken;
};

test('GET /auth/me needs a token', async () => {
  assert.equal((await api.request('/auth/me')).status, 401);
});

test('GET /auth/me returns the signed-in user', async () => {
  const token = await login('admin@dpercp.test');
  const res = await api.request('/auth/me', { token });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).user.role, 'admin');
});

test('a tampered or expired token is rejected', async () => {
  const bad = jwt.sign({ role: 'admin' }, 'some-other-secret', { subject: 'x' });
  const expired = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { subject: 'x', expiresIn: -10 });
  assert.equal((await api.request('/auth/me', { token: bad })).status, 401);
  assert.equal((await api.request('/auth/me', { token: expired })).status, 401);
});
