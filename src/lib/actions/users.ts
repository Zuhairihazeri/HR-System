'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { auth } from '@/auth';

async function isAdmin() {
  const session = await auth();
  return (session?.user as any)?.role === 'ADMIN';
}

export async function getUsers() {
  if (!await isAdmin()) throw new Error('Unauthorized');
  
  return await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function createUser(data: any) {
  if (!await isAdmin()) throw new Error('Unauthorized');

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || 'USER',
    },
  });

  revalidatePath('/settings');
  return user;
}

export async function updateUser(id: string, data: any) {
  if (!await isAdmin()) throw new Error('Unauthorized');

  const updateData: any = {
    name: data.name,
    email: data.email,
    role: data.role,
  };

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
  });

  revalidatePath('/settings');
  return user;
}

export async function deleteUser(id: string) {
  if (!await isAdmin()) throw new Error('Unauthorized');

  await prisma.user.delete({
    where: { id },
  });

  revalidatePath('/settings');
  return { success: true };
}
