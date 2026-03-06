"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Receipt, Plane, Stethoscope, Search, User, Plus, Check, X, Clock, Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getPekerja } from "@/lib/actions/pekerja"
import { createClaim, getClaims } from "@/lib/actions/modules"
import { useSession } from "next-auth/react"

export default function ClaimsPage() {
  const { data: session } = useSession()
  const isAdmin = (session?.user as any)?.role === "ADMIN"
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pekerjaList, setPekerjaList] = useState<any[]>([])
  const [claims, setClaims] = useState<any[]>([])
  
  // Form State
  const [isAdding, setIsAdding] = useState(false)
  const [selectedPekerjaId, setSelectedPekerjaId] = useState("")
  const [type, setType] = useState("MEDICAL")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [pekerjaRes, claimsRes] = await Promise.all([
          getPekerja(""),
          getClaims()
        ])
        setPekerjaList(pekerjaRes.data || [])
        setClaims(claimsRes)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSave = async () => {
    if (!selectedPekerjaId || !amount || !description) return
    setSaving(true)
    try {
      await createClaim({
        employeeId: selectedPekerjaId,
        type,
        amount: parseFloat(amount),
        description
      })
      const updated = await getClaims()
      setClaims(updated)
      setIsAdding(false)
      setSelectedPekerjaId("")
      setAmount("")
      setDescription("")
    } catch (error) {
      console.error("Failed to save claim:", error)
    } finally {
      setSaving(false)
    }
  }

  // Calculate Totals
  const pendingCount = claims.filter(c => c.status === 'PENDING').length
  const totalAmount = claims.reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tuntutan & Cuti Sakit</h1>
          <p className="text-gray-500">Urus permohonan tuntutan perubatan, perjalanan, dan lain-lain.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAdding(!isAdding)} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" />
            Hantar Tuntutan Baru
          </Button>
        </div>
      </div>

      {isAdding && (
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Tambah Tuntutan Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
                <option value="MEDICAL">MEDICAL</option>
                <option value="MILEAGE">MILEAGE</option>
                <option value="OTHER">OTHER</option>
              </select>
              <Input 
                placeholder="Jumlah (RM)" 
                type="number"
                className="bg-white" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Input 
                placeholder="Deskripsi" 
                className="bg-white" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="relative group">
                <Input type="file" className="bg-white h-9 text-[10px] opacity-0 absolute inset-0 z-10 cursor-pointer" />
                <div className="h-9 w-full border border-dashed border-gray-300 rounded-md bg-white flex items-center justify-center gap-2 text-gray-400 text-xs">
                  <Upload className="h-3 w-3" />
                  Pilih Fail
                </div>
              </div>
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Hantar Tuntutan"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase">Menunggu Kelulusan</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase">Jumlah Tuntutan (Mac)</CardTitle>
            <Receipt className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM {totalAmount.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase">Tuntutan Perubatan</CardTitle>
            <Stethoscope className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM {claims.filter(c => c.type === 'MEDICAL').reduce((sum, c) => sum + c.amount, 0).toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase">Perjalanan (Mileage)</CardTitle>
            <Plane className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM {claims.filter(c => c.type === 'MILEAGE').reduce((sum, c) => sum + c.amount, 0).toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Claims List */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Senarai Permohonan Tuntutan</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder="Cari tuntutan..." className="pl-9 h-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                <tr>
                  <th className="px-6 py-3">Pekerja</th>
                  <th className="px-6 py-3">Jenis</th>
                  <th className="px-6 py-3">Deskripsi</th>
                  <th className="px-6 py-3">Jumlah</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Memuatkan data sistem...</td></tr>
                ) : claims.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Tiada tuntutan lagi.</td></tr>
                ) : (
                  claims.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center">
                            <User className="h-4 w-4 text-indigo-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{c.employee.firstName} {c.employee.lastName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {c.type === 'MEDICAL' && <Stethoscope className="h-3 w-3 text-rose-500" />}
                          {c.type === 'MILEAGE' && <Plane className="h-3 w-3 text-sky-500" />}
                          {c.type === 'OTHER' && <FileText className="h-3 w-3 text-gray-500" />}
                          <span className="text-[10px] font-bold uppercase">{c.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 truncate max-w-[200px]">{c.description}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">RM {c.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          c.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                          c.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isAdmin ? (
                          <div className="flex justify-end gap-1">
                            <Button variant="outline" size="icon" className="h-8 w-8 text-emerald-600 hover:text-emerald-700">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8 text-rose-600 hover:text-rose-700">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Papar Sahaja</span>
                        )}
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
