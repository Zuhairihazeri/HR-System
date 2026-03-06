"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// ATTENDANCE ACTIONS
export async function getAttendances() {
  try {
    return await prisma.attendance.findMany({
      include: { employee: true },
      orderBy: { date: "desc" }
    })
  } catch (error) {
    console.error("Error fetching attendances:", error)
    return []
  }
}

export async function createAttendance(data: {
  employeeId: string
  checkIn: Date
  status: string
}) {
  try {
    const res = await prisma.attendance.create({ data })
    revalidatePath("/attendance")
    return res
  } catch (error) {
    console.error("Error creating attendance:", error)
    throw new Error("Failed to save attendance.")
  }
}

// DISCIPLINE ACTIONS
export async function getDisciplineRecords() {
  try {
    return await prisma.disciplinaryRecord.findMany({
      include: { employee: true },
      orderBy: { date: "desc" }
    })
  } catch (error) {
    console.error("Error fetching discipline records:", error)
    return []
  }
}

export async function createDisciplineRecord(data: {
  employeeId: string
  type: string
  description: string
}) {
  try {
    const res = await prisma.disciplinaryRecord.create({ data })
    revalidatePath("/discipline")
    return res
  } catch (error) {
    console.error("Error creating discipline record:", error)
    throw new Error("Failed to save discipline record.")
  }
}

// CLAIMS ACTIONS
export async function getClaims() {
  try {
    return await prisma.claim.findMany({
      include: { employee: true },
      orderBy: { createdAt: "desc" }
    })
  } catch (error) {
    console.error("Error fetching claims:", error)
    return []
  }
}

export async function createClaim(data: {
  employeeId: string
  type: string
  amount: number
  description: string
}) {
  try {
    const res = await prisma.claim.create({ data })
    revalidatePath("/claims")
    return res
  } catch (error) {
    console.error("Error creating claim:", error)
    throw new Error("Failed to save claim.")
  }
}

// SETTINGS ACTIONS
export async function getCompanySettings() {
  try {
    return await prisma.company.findFirst()
  } catch (error) {
    console.error("Error fetching settings:", error)
    return null
  }
}

export async function updateCompanySettings(id: string, data: {
  name: string
  email: string
  regNo: string
  address: string
}) {
  try {
    const res = await prisma.company.update({
      where: { id },
      data
    })
    revalidatePath("/settings")
    return res
  } catch (error) {
    console.error("Error updating settings:", error)
    throw new Error("Failed to update settings.")
  }
}

// CALENDAR ACTIONS
export async function getCalendarEvents() {
  try {
    return await prisma.calendarEvent.findMany({
      orderBy: { date: "asc" }
    })
  } catch (error) {
    console.error("Error fetching events:", error)
    return []
  }
}

export async function createCalendarEvent(data: {
  title: string
  date: Date
  type: string
  description?: string
}) {
  try {
    const res = await prisma.calendarEvent.create({ data })
    revalidatePath("/calendar")
    return res
  } catch (error) {
    console.error("Error creating event:", error)
    throw new Error("Failed to save event.")
  }
}

// DASHBOARD SYNC ACTIONS
export async function getDashboardSummary() {
  try {
    const [employeeCount, payrolls, attendances, disciplineCount] = await Promise.all([
      prisma.employee.count(),
      prisma.payroll.findMany({
        where: { month: 3, year: 2026 } // Current month sync
      }),
      prisma.attendance.findMany({
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      }),
      prisma.disciplinaryRecord.count({ where: { isActive: true } })
    ])

    const totalGross = payrolls.reduce((sum, p) => sum + p.grossSalary, 0)
    const presentToday = attendances.filter(a => a.status === "HADIR").length
    const lateToday = attendances.filter(a => a.status === "LEWAT").length
    
    // Detailed Payroll Breakdown
    const kwspTotal = payrolls.reduce((sum, p) => sum + p.kwsp, 0)
    const perkesoTotal = payrolls.reduce((sum, p) => sum + p.perkeso, 0)
    const eisTotal = payrolls.reduce((sum, p) => sum + p.eis, 0)

    return {
      employeeCount,
      totalGross,
      presentToday,
      lateToday,
      disciplineCount,
      payrollBreakdown: {
        kwsp: kwspTotal,
        perkeso: perkesoTotal,
        eis: eisTotal
      }
    }
  } catch (error) {
    console.error("Error fetching dashboard summary:", error)
    return {
      employeeCount: 0,
      totalGross: 0,
      presentToday: 0,
      lateToday: 0,
      disciplineCount: 0,
      payrollBreakdown: { kwsp: 0, perkeso: 0, eis: 0 }
    }
  }
}
