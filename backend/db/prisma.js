import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

import prismaPackage from '@prisma/client';

const { PrismaClient } = prismaPackage;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});