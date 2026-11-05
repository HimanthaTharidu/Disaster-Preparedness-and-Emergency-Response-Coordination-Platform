import { prisma } from '../db/prisma.js';

export const findByEmail = (email) =>
  prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

export const findById = (id) =>
  prisma.user.findUnique({
    where: { id },
  });

export const create = (data) =>
  prisma.user.create({ data });
