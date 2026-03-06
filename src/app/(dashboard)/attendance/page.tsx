"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CheckCircle, AlertCircle, Search, User, LogIn, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getPekerja } from "@/lib/actions/pekerja"
import { createAttendance, getAttendances } from "@/lib/actions/modules"
import { useSession } from "next-auth/react"

export default function AttendancePage() {
  const { data: session } = useSession()
  const isAdmin = (session?.user as any)?.role === "ADMIN"
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pekerjaList, setPekerjaList] = useState<any[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
  
  // Form State
  const [isAdding, setIsAdding] = useState(false)
  const [selectedPekerjaId, setSelectedPekerjaId] = useState("")
  const [status, setStatus] = useState("HADIR")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [pekerjaRes, attendRes] = await Promise.all([
          getPekerja(""),
          getAttendances()
        ])
        setPekerjaList(pekerjaRes.data || [])
        setAttendanceRecords(attendRes)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSave = async () => {
    if (!selectedPekerjaId) return
    setSaving(true)
    try {
      await createAttendance({
        employeeId: selectedPekerjaId,
        checkIn: new Date(),
        status
      })
      const updated = await getAttendances()
      setAttendanceRecords(updated)
      setIsAdding(false)
      setSelectedPekerjaId("")
    } catch (error) {
      console.error("Failed to save attendance:", error)
    } finally {
      setSaving(false)
    }
  }

  // Calculate Stats
  const presentToday = attendanceRecords.filter(r => r.status === 'HADIR').length
  const lateToday = attendanceRecords.filter(r => r.status === 'LEWAT').length

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rekod Kehadiran</h1>
          <p className="text-gray-500">Pantau kehadiran harian dan masa bekerja pekerja anda.</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Button onClick={() => setIsAdding(!isAdding)} className="bg-emerald-600 hover:bg-emerald-700">
              <LogIn className="mr-2 h-4 w-4" />
              Check-in Manual
            </Button>
          )}
        </div>
      </div>

      {isAdding && isAdmin && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Rekod Kehadiran Manual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select 
                value={selectedPekerjaId}
                onChange={(e) => setSelectedPekerjaId(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm"
              >
                <option value="">Pilih Pekerja</option>
                {pekerjaList.map((p) => (
                  <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                ))}
              </select>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm"
              >
                <option value="HADIR">HADIR</option>
                <option value="LEWAT">LEWAT</option>
                <option value="TIDAK HADIR">TIDAK HADIR</option>
              </select>
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Simpan Rekod"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-emerald-50 border-emerald-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-emerald-800 uppercase">Hadir Hari Ini</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">{presentToday}</div>
            <p className="text-xs text-emerald-600 mt-1">Darikada {pekerjaList.length} pekerja</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-amber-800 uppercase">Lewat</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{lateToday}</div>
            <p className="text-xs text-amber-600 mt-1">Lewat hari ini</p>
          </CardContent>
        </Card>
        <Card className="bg-rose-50 border-rose-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-rose-800 uppercase">Tidak Hadir</CardTitle>
            <AlertCircle className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-900">{pekerjaList.length - presentToday - lateToday}</div>
            <p className="text-xs text-rose-600 mt-1">Sila semak permohonan cuti</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Log Kehadiran - 6 Mac 2026</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder="Cari rekod..." className="pl-9 h-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                <tr>
                  <th className="px-6 py-3">Pekerja</th>
                  <th className="px-6 py-3">Masa Masuk</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Memuatkan data sistem...</td></tr>
                ) : attendanceRecords.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Tiada rekod kehadiran lagi.</td></tr>
                ) : (
                  attendanceRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center">
                            <User className="h-4 w-4 text-indigo-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{r.employee.firstName} {r.employee.lastName}</p>
                            <p className="text-xs text-gray-500">{r.employee.position}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">{new Date(r.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          r.status === 'HADIR' ? 'bg-emerald-100 text-emerald-700' :
                          r.status === 'LEWAT' ? 'bg-amber-100 text-amber-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="text-indigo-600 h-8">Papar Log</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
