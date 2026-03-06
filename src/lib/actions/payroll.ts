"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getPayrolls() {
  try {
    return await prisma.payroll.findMany({
      include: {
        employee: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })
  } catch (error) {
    console.error("Error fetching payrolls:", error)
    return []
  }
}

export async function createPayroll(data: {
  employeeId: string
  month: number
  year: number
  grossSalary: number
  netSalary: number
  kwsp: number
  perkeso: number
  eis: number
  status: string
}) {
  try {
    const payroll = await prisma.payroll.create({
      data,
      include: {
        employee: true
      }
    })
    revalidatePath("/payroll")
    return payroll
  } catch (error) {
    console.error("Error creating payroll:", error)
    throw new Error("Failed to save payroll record.")
  }
}
