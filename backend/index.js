import 'dotenv/config';
import app from './app.js';
import { prisma, pool } from './db/prisma.js';

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});


async function shoutdown() {
  console.log("shutting down...");
  server.close( async () => {
    await prisma.$disconnect();
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', shoutdown);
process.on('SIGTERM', shoutdown);
