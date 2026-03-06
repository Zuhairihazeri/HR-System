"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, Clock, ShieldAlert, Plus, AlertCircle, FileText, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getDashboardSummary, getCalendarEvents } from "@/lib/actions/modules"
import { useSession } from "next-auth/react"

export default function DashboardPage() {
  const { data: session } = useSession()
  const isAdmin = (session?.user as any)?.role === "ADMIN"
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [sumRes, eventRes] = await Promise.all([
          getDashboardSummary(),
          getCalendarEvents()
        ])
        setSummary(sumRes)
        setEvents(eventRes)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      <p className="text-sm text-gray-500 font-medium">Menyusun semula data sistem...</p>
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Selamat Pagi, HR Management</h1>
        <p className="text-gray-500">Berikut adalah ringkasan sistem anda hari ini.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-indigo-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Jumlah Pekerja</CardTitle>
            <Users className="h-4 w-4 opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.employeeCount}</div>
            <p className="text-xs opacity-70">Pekerja berdaftar</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Kos Gaji (Bulan Ini)</CardTitle>
            <CreditCard className="h-4 w-4 opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM {summary.totalGross.toLocaleString()}</div>
            <p className="text-xs opacity-70">Sedia untuk dibayar</p>
          </CardContent>
        </Card>
        <Card className="bg-sky-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Hadir Hari Ini</CardTitle>
            <Clock className="h-4 w-4 opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.presentToday}</div>
            <p className="text-xs opacity-70">{summary.lateToday} pekerja lewat hari ini</p>
          </CardContent>
        </Card>
        <Card className="bg-rose-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Teguran Aktif</CardTitle>
            <ShieldAlert className="h-4 w-4 opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.disciplineCount}</div>
            <p className="text-xs opacity-70">Perlukan tindakan segera</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ringkasan Kos Gaji</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-b">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Gaji Kasar</p>
                    <p className="text-lg font-semibold">RM {summary.totalGross.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">KWSP</p>
                    <p className="text-lg font-semibold">RM {summary.payrollBreakdown.kwsp.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">PERKESO</p>
                    <p className="text-lg font-semibold">RM {summary.payrollBreakdown.perkeso.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">EIS</p>
                    <p className="text-lg font-semibold">RM {summary.payrollBreakdown.eis.toLocaleString()}</p>
                  </div>
                </div>
                {summary.totalGross === 0 && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 rounded-md text-sm border border-amber-100">
                    <AlertCircle className="h-4 w-4" />
                    <span>Tiada rekod gaji untuk bulan ini. Sila buat pengiraan di tab Payroll.</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isAdmin && (
              <Link href="/pekerja/new">
                <Button variant="outline" className="h-24 w-full flex flex-col gap-2 bg-white">
                  <Plus className="h-6 w-6 text-indigo-600" />
                  <span className="text-xs font-medium">Tambah Pekerja</span>
                </Button>
              </Link>
            )}
            <Link href="/payroll">
              <Button variant="outline" className="h-24 w-full flex flex-col gap-2 bg-white">
                <FileText className="h-6 w-6 text-emerald-600" />
                <span className="text-xs font-medium">Gaji & Payroll</span>
              </Button>
            </Link>
            <Link href="/attendance">
              <Button variant="outline" className="h-24 w-full flex flex-col gap-2 bg-white">
                <Clock className="h-6 w-6 text-sky-600" />
                <span className="text-xs font-medium">Kehadiran</span>
              </Button>
            </Link>
            <Link href="/discipline">
              <Button variant="outline" className="h-24 w-full flex flex-col gap-2 bg-white">
                <ShieldAlert className="h-6 w-6 text-rose-600" />
                <span className="text-xs font-medium">Disiplin</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Side Section: Events/Reminders */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Acara & Peringatan</CardTitle>
              <Link href="/calendar">
                <Button variant="ghost" size="sm" className="text-indigo-600 h-8">Lihat Semua</Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-6">
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-8 w-8 text-gray-200 mx-auto" />
                  <p className="text-xs text-gray-400 mt-2">Tiada acara akan datang.</p>
                </div>
              ) : (
                events.slice(0, 5).map((e) => (
                  <div key={e.id} className="flex gap-4">
                    <div className={`h-10 w-10 rounded flex items-center justify-center flex-shrink-0 ${
                      e.type === 'BIRTHDAY' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
                    }`}>
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{e.title}</p>
                      <p className="text-xs text-gray-500">{new Date(e.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
