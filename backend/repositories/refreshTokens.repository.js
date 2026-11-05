import { randomBytes, createHash } from 'node:crypto';
import { prisma } from '../db/prisma.js';

const DAYS = Number(process.env.REFRESH_TTL_DAYS) || 7;

const hash = (token) =>
  createHash('sha256').update(token).digest('hex');

export async function create(userId) {
  const token = randomBytes(32).toString('base64url');

  await prisma.refreshToken.create({
    data: {
      tokenHash: hash(token),
      userId,
      expiresAt: new Date(Date.now() + DAYS * 24 * 60 * 60 * 1000),
    },
  });

  return token;
}

export async function consume(token) {
  const tokenHash = hash(token);

  const record = await prisma.refreshToken.findUnique({
    where: { tokenHash },
  });

  if (!record) return undefined;

  const result = await prisma.refreshToken.deleteMany({
    where: {
      tokenHash,
      expiresAt: { gt: new Date() },
    },
  });

  // A count of zero means it expired or another request already used it.
  if (result.count === 0) return undefined;

  return record.userId;
}

export async function revoke(token) {
  const result = await prisma.refreshToken.deleteMany({
    where: { tokenHash: hash(token) },
  });

  return result.count > 0;
}