import { readFileSync } from 'node:fs';
import { hashPassword } from "../utils/password.js";
import { prisma, pool } from '../db/prisma.js';

function readJson(relativePath){
    return JSON.parse(
        readFileSync(new URL(relativePath, import.meta.url), 'utf8')
    );
}


const users = readJson('../data/users.json');
const incidents = readJson('../data/incidents.json');
const shelters = readJson('../data/shelters.json');

async function main() {
  // Hash fixture passwords before storing them.
  const usersToSeed = await Promise.all(
    users.map(async ({ password, ...user }) => ({
      ...user,
      email: user.email.toLowerCase(),
      passwordHash: await hashPassword(password),
    }))
  );

  // Use a transaction so all fixture records are applied together.
  await prisma.$transaction(async (tx) => {
    for (const user of usersToSeed) {
      await tx.user.upsert({
        where: { id: user.id },
        create: user,
        update: user,
      });
    }

    for (const incident of incidents) {
      await tx.incident.upsert({
        where: { id: incident.id },
        create: {
          ...incident,
          reportedAt: new Date(incident.reportedAt),
        },
        update: {
          ...incident,
          reportedAt: new Date(incident.reportedAt),
        },
      });
    }

    for (const shelter of shelters) {
      await tx.shelter.upsert({
        where: { id: shelter.id },
        create: shelter,
        update: shelter,
      });
    }
  });

  console.log(
    `Seeded ${users.length} users, ${incidents.length} incidents, and ${shelters.length} shelters.`
  );
}

try {
  await main();
} catch (error) {
  console.error('Seeding failed:', error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
  await pool.end();
}