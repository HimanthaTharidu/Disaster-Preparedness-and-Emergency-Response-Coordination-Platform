import { randomBytes, createHash } from 'node:crypto';

const DAYS = Number(process.env.REFRESH_TTL_DAYS) || 7;
// shortcut: tokens live in memory and vanish on restart, move to Redis or a table with Prisma.
const store = new Map();

const hash = (token) => createHash('sha256').update(token).digest('hex');

export function create(userId) {
  const token = randomBytes(32).toString('base64url');
  store.set(hash(token), { userId, expiresAt: Date.now() + DAYS * 24 * 60 * 60 * 1000 });
  return token;
}

// Single use: a token is deleted as soon as it is looked up, so a replayed one fails.
export function consume(token) {
  const entry = store.get(hash(token));
  store.delete(hash(token));
  return entry && entry.expiresAt > Date.now() ? entry.userId : undefined;
}

export const revoke = (token) => store.delete(hash(token));
