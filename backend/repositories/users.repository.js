import { readFileSync } from 'node:fs';
import { hashPassword } from '../utils/password.js';

const seed = JSON.parse(readFileSync(new URL('../data/users.json', import.meta.url)));

// Mock data: seed passwords are hashed once at startup, plain text is never kept.
const users = await Promise.all(
  seed.map(async ({ password, ...user }) => ({ ...user, passwordHash: await hashPassword(password) }))
);

export const findByEmail = (email) => users.find((u) => u.email === email.toLowerCase());
export const findById = (id) => users.find((u) => u.id === id);
