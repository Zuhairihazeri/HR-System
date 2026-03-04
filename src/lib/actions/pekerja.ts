'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getPekerja() {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        company: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return { success: true, data: employees };
  } catch (error) {
    console.error('Error fetching employees:', error);
    return { success: false, error: 'Failed to fetch employees' };
  }
}

export async function createPekerja(data: any) {
  try {
    const employee = await prisma.employee.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        position: data.position,
        companyId: data.companyId,
      },
    });
    revalidatePath('/pekerja');
    return { success: true, data: employee };
  } catch (error) {
    console.error('Error creating employee:', error);
    return { success: false, error: 'Failed to create employee' };
  }
}

export async function updatePekerja(id: string, data: any) {
  try {
    const employee = await prisma.employee.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        position: data.position,
      },
    });
    revalidatePath('/pekerja');
    revalidatePath(`/pekerja/${id}`);
    return { success: true, data: employee };
  } catch (error) {
    console.error('Error updating employee:', error);
    return { success: false, error: 'Failed to update employee' };
  }
}

export async function deletePekerja(id: string) {
  try {
    await prisma.employee.delete({
      where: { id },
    });
    revalidatePath('/pekerja');
    return { success: true };
  } catch (error) {
    console.error('Error deleting employee:', error);
    return { success: false, error: 'Failed to delete employee' };
  }
}
