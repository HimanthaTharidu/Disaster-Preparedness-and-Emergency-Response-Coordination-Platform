import { prisma } from '../db/prisma.js';

export const list = ({ status, priority } = {}) =>
  prisma.incident.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
    },
    orderBy: { reportedAt: 'desc' },
  });

export const findById = (id) =>
  prisma.incident.findUnique({
    where: { id },
  });