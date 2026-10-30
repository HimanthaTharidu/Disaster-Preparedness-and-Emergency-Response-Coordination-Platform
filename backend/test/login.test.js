import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from './helpers.js';
import { verifyAccessToken } from '../utils/token.js';

let api;
before(async () => { api = await startServer(); });
after(() => api.close());

test('login returns a token and the user without secrets', async () => {
  const res = await api.request('/auth/login', { body: { email: 'operator@dpercp.test', password: 'ChangeMe123!' } });
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.user.role, 'operator');
  assert.equal(body.user.passwordHash, undefined);
  assert.equal(verifyAccessToken(body.accessToken).sub, body.user.id);
});

test('wrong password and unknown email get the same 401', async () => {
  const a = await api.request('/auth/login', { body: { email: 'operator@dpercp.test', password: 'nope' } });
  const b = await api.request('/auth/login', { body: { email: 'nobody@dpercp.test', password: 'nope' } });
  assert.equal(a.status, 401);
  assert.equal(b.status, 401);
  assert.deepEqual(await a.json(), await b.json());
});

test('a malformed body gets a 400', async () => {
  const res = await api.request('/auth/login', { body: { email: 'not-an-email' } });
  assert.equal(res.status, 400);
});
