import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findByEmail } from '../repositories/users.repository.js';
import { verifyPassword } from '../utils/password.js';
import * as incidents from '../repositories/incidents.repository.js';
import * as shelters from '../repositories/shelters.repository.js';

test('seed users get a password hash and no plain password', async () => {
  const user = findByEmail('operator@dpercp.test');
  assert.equal(user.password, undefined);
  assert.equal(await verifyPassword(user.passwordHash, 'ChangeMe123!'), true);
});

test('incidents and shelters are loaded and consistent', () => {
  assert.ok(incidents.list().length >= 5);
  assert.ok(incidents.findById(incidents.list()[0].id));
  for (const s of shelters.list()) assert.ok(s.occupancy <= s.capacity, s.name);
});
