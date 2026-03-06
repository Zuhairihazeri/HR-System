"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, AlertTriangle, FileText, Search, User, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getPekerja } from "@/lib/actions/pekerja"
import { createDisciplineRecord, getDisciplineRecords } from "@/lib/actions/modules"
import { useSession } from "next-auth/react"

export default function DisciplinePage() {
  const { data: session } = useSession()
  const isAdmin = (session?.user as any)?.role === "ADMIN"
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pekerjaList, setPekerjaList] = useState<any[]>([])
  const [records, setRecords] = useState<any[]>([])
  
  // Form State
  const [isAdding, setIsAdding] = useState(false)
  const [selectedPekerjaId, setSelectedPekerjaId] = useState("")
  const [type, setType] = useState("AMARAN LISAN")
  const [description, setDescription] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [pekerjaRes, discRes] = await Promise.all([
          getPekerja(""),
          getDisciplineRecords()
        ])
        setPekerjaList(pekerjaRes.data || [])
        setRecords(discRes)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSave = async () => {
    if (!selectedPekerjaId || !description) return
    setSaving(true)
    try {
      await createDisciplineRecord({
        employeeId: selectedPekerjaId,
        type,
        description
      })
      const updated = await getDisciplineRecords()
      setRecords(updated)
      setIsAdding(false)
      setSelectedPekerjaId("")
      setDescription("")
    } catch (error) {
      console.error("Failed to save discipline record:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rekod Disiplin</h1>
          <p className="text-gray-500">Urus teguran, amaran, dan tindakan tatatertib pekerja.</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Button onClick={() => setIsAdding(!isAdding)} className="bg-rose-600 hover:bg-rose-700">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Rekod Disiplin
            </Button>
          )}
        </div>
      </div>

      {isAdding && isAdmin && (
        <Card className="border-rose-200 bg-rose-50/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Rekod Kes Tatatertib Baru</CardTitle>
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
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm"
              >
                <option value="AMARAN LISAN">AMARAN LISAN</option>
                <option value="AMARAN BERTULIS">AMARAN BERTULIS</option>
                <option value="SURAT TUNJUK SEBAB">SURAT TUNJUK SEBAB</option>
                <option value="GANTUNG KERJA">GANTUNG KERJA</option>
              </select>
              <Input 
                placeholder="Sebab / Justifikasi" 
                className="bg-white" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="bg-rose-600 hover:bg-rose-700"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Simpan Rekod"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-rose-50 border-rose-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-rose-800 uppercase">Kes Aktif</CardTitle>
            <ShieldAlert className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-900">{records.filter(r => r.isActive).length}</div>
            <p className="text-xs text-rose-600 mt-1">Perlukan tindakan segera</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-amber-800 uppercase">Amaran Dikeluarkan</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{records.length}</div>
            <p className="text-xs text-amber-600 mt-1">Keseluruhan rekod</p>
          </CardContent>
        </Card>
        <Card className="bg-sky-50 border-sky-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-sky-800 uppercase">Pekerja Berisiko</CardTitle>
            <FileText className="h-4 w-4 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-900">{new Set(records.map(r => r.employeeId)).size}</div>
            <p className="text-xs text-sky-600 mt-1">Jumlah pekerja terlibat</p>
          </CardContent>
        </Card>
      </div>

      {/* Discipline Records Table */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Senarai Kes Tatatertib</CardTitle>
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
                  <th className="px-6 py-3">Jenis Tindakan</th>
                  <th className="px-6 py-3">Tarikh</th>
                  <th className="px-6 py-3">Sebab / Justifikasi</th>
                  <th className="px-6 py-3 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Memuatkan data sistem...</td></tr>
                ) : records.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Tiada rekod disiplin lagi.</td></tr>
                ) : (
                  records.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-rose-50 flex items-center justify-center">
                            <User className="h-4 w-4 text-rose-400" />
                          </div>
                          <p className="font-medium text-gray-900">{r.employee.firstName} {r.employee.lastName}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-rose-600 text-[10px] uppercase">{r.type}</td>
                      <td className="px-6 py-4 text-gray-600">{new Date(r.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-gray-600 italic">"{r.description}"</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="text-indigo-600 h-8">Papar Kes</Button>
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
