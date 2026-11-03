import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from './helpers.js';

let api, operator, field;
before(async () => {
  api = await startServer();
  const login = async (email) =>
    (await (await api.request('/auth/login', { body: { email, password: 'ChangeMe123!' } })).json()).accessToken;
  operator = await login('operator@dpercp.test');
  field = await login('field@dpercp.test');
});
after(() => api.close());

test('operators list incidents, newest first', async () => {
  const body = await (await api.request('/incidents', { token: operator })).json();
  assert.ok(body.incidents.length >= 5);
  const times = body.incidents.map((i) => i.reportedAt);
  assert.deepEqual(times, [...times].sort().reverse());
});

test('incidents filter by priority and reject unknown values', async () => {
  const body = await (await api.request('/incidents?priority=critical', { token: operator })).json();
  assert.ok(body.incidents.length > 0);
  assert.ok(body.incidents.every((i) => i.priority === 'critical'));
  assert.equal((await api.request('/incidents?priority=urgent', { token: operator })).status, 400);
});

test('an incident can be opened by id and a missing one is a 404', async () => {
  const { incidents } = await (await api.request('/incidents', { token: operator })).json();
  assert.equal((await api.request(`/incidents/${incidents[0].id}`, { token: operator })).status, 200);
  assert.equal((await api.request('/incidents/does-not-exist', { token: operator })).status, 404);
});

test('field teams cannot open the incident queue, anonymous users get a 401', async () => {
  assert.equal((await api.request('/incidents', { token: field })).status, 403);
  assert.equal((await api.request('/incidents')).status, 401);
});

test('any signed-in user can list shelters', async () => {
  const res = await api.request('/shelters', { token: field });
  assert.equal(res.status, 200);
  assert.ok((await res.json()).shelters.length > 0);
});
