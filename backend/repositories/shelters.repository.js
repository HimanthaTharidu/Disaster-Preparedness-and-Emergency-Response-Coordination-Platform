import { prisma } from '../db/prisma.js';

export const list = () =>
  prisma.shelter.findMany({
    orderBy: { name: 'asc' },
  });