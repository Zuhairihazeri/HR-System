import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const company = await prisma.company.upsert({
    where: { email: 'hr@example.com' },
    update: {},
    create: {
      name: 'Default Company',
      email: 'hr@example.com',
    },
  });

  console.log({ company });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
