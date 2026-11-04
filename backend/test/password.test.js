import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword } from '../utils/password.js';

test('a password verifies against its own hash only', async () => {
  const hash = await hashPassword('correct horse');
  assert.notEqual(hash, 'correct horse');
  assert.equal(await verifyPassword(hash, 'correct horse'), true);
  assert.equal(await verifyPassword(hash, 'wrong horse'), false);
});
