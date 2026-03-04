'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

const employeeSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  position: z.string().min(2),
  companyId: z.string().min(1),
});

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

export async function getPekerjaById(id: string) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });
    return { success: true, data: employee };
  } catch (error) {
    console.error('Error fetching employee:', error);
    return { success: false, error: 'Failed to fetch employee' };
  }
}

export async function getCompanies() {
  try {
    const companies = await prisma.company.findMany();
    return { success: true, data: companies };
  } catch (error) {
    console.error('Error fetching companies:', error);
    return { success: false, error: 'Failed to fetch companies' };
  }
}

export async function createPekerja(data: any) {
  try {
    const validatedData = employeeSchema.parse(data);
    const employee = await prisma.employee.create({
      data: validatedData,
    });
    revalidatePath('/pekerja');
    return { success: true, data: employee };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error('Error creating employee:', error);
    return { success: false, error: 'Failed to create employee' };
  }
}

export async function updatePekerja(id: string, data: any) {
  try {
    const validatedData = employeeSchema.parse(data);
    const employee = await prisma.employee.update({
      where: { id },
      data: validatedData,
    });
    revalidatePath('/pekerja');
    revalidatePath(`/pekerja/${id}`);
    return { success: true, data: employee };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
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
