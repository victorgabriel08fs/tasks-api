import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import argon2 from 'argon2';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'dev@example.com' },
    update: {},
    create: {
      email: 'dev@example.com',
      name: 'Dev',
      passwordHash: await argon2.hash('password'),
    },
  });

  await prisma.task.createMany({
    data: [
      { title: 'Terminar o Nível 2', ownerId: user.id },
      { title: 'Escrever os testes', ownerId: user.id, done: true },
    ],
    skipDuplicates: true,
  });
}

await main();
await prisma.$disconnect();
