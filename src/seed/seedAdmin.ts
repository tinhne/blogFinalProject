// prisma/seedAdmin.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedAdmin() {
  const adminEmail = 'admin@example.com';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.user.findFirst({
    where: {
      email: adminEmail,
      isAdmin: true,
    },
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      isAdmin: true,
      isVerified: true,
      gender: 'UNSPECIFIED',
    },
  });

  console.log('Admin user seeded successfully');
}

seedAdmin()
  .catch((e) => {
    console.error('Error seeding admin:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
