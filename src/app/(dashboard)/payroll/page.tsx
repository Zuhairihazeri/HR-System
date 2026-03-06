"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, FileText, Printer, Search, Plus, Download, Loader2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { jsPDF } from "jspdf"
import { getPekerja } from "@/lib/actions/pekerja"
import { createPayroll, getPayrolls } from "@/lib/actions/payroll"

export default function PayrollPage() {
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pekerjaList, setPekerjaList] = useState<any[]>([])
  const [payrollList, setPayrollList] = useState<any[]>([])
  
  // Form State
  const [selectedPekerjaId, setSelectedPekerjaId] = useState("")
  const [grossSalary, setGrossSalary] = useState("")
  const [kwsp, setKwsp] = useState("")

  // Fetch data on load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [pekerjaRes, payrollRes] = await Promise.all([
          getPekerja(""),
          getPayrolls()
        ])
        setPekerjaList(pekerjaRes.data || []) // Corrected to use .data
        setPayrollList(payrollRes)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSave = async () => {
    if (!selectedPekerjaId || !grossSalary) return
    
    setSaving(true)
    try {
      const gross = parseFloat(grossSalary)
      const kwspAmount = parseFloat(kwsp) || 0
      const perkeso = gross * 0.005 // Simple estimate
      const eis = gross * 0.002 // Simple estimate
      const net = gross - kwspAmount - perkeso - eis

      await createPayroll({
        employeeId: selectedPekerjaId,
        month: 3,
        year: 2026,
        grossSalary: gross,
        kwsp: kwspAmount,
        perkeso: perkeso,
        eis: eis,
        netSalary: net,
        status: "DIBAYAR"
      })

      // Refresh data
      const updatedPayrolls = await getPayrolls()
      setPayrollList(updatedPayrolls)
      setIsAdding(false)
      setSelectedPekerjaId("")
      setGrossSalary("")
      setKwsp("")
    } catch (error) {
      console.error("Failed to save payroll:", error)
    } finally {
      setSaving(false)
    }
  }

  // PDF Generator for Payslip
  const generatePDF = (payroll: any) => {
    const doc = new jsPDF()
    const workerName = `${payroll.employee.firstName} ${payroll.employee.lastName}`
    
    // Header
    doc.setFontSize(22)
    doc.setTextColor(79, 70, 229) // Indigo-600
    doc.text("HR MANAGEMENT - SLIP GAJI", 105, 20, { align: "center" })
    
    // Line
    doc.setDrawColor(200, 200, 200)
    doc.line(20, 30, 190, 30)
    
    // Worker Info
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`Nama Pekerja: ${workerName}`, 20, 45)
    doc.text(`Bulan: Mac 2026`, 20, 52)
    doc.text(`Syarikat: HR Management`, 20, 59)
    
    // Salary Breakdown Table
    doc.setFillColor(245, 245, 245)
    doc.rect(20, 70, 170, 10, "F")
    doc.text("Deskripsi", 25, 77)
    doc.text("Jumlah (RM)", 150, 77)
    
    doc.text("Gaji Kasar (Gross)", 25, 90)
    doc.text(`${payroll.grossSalary.toFixed(2)}`, 150, 90)
    
    doc.text("Potongan KWSP", 25, 100)
    doc.text(`${payroll.kwsp.toFixed(2)}`, 150, 100)
    
    doc.text("Potongan SOCSO/EIS", 25, 110)
    doc.text(`${(payroll.perkeso + payroll.eis).toFixed(2)}`, 150, 110)
    
    doc.line(20, 120, 190, 120)
    
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("GAJI BERSIH (NET)", 25, 135)
    doc.text(`${payroll.netSalary.toFixed(2)}`, 150, 135)
    
    // Footer
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text("Dokumen ini dihasilkan secara komputer. Tiada tandatangan diperlukan.", 105, 160, { align: "center" })
    
    doc.save(`Slip_Gaji_${workerName}_Mac_2026.pdf`)
  }

  // Calculate Totals
  const totalGross = payrollList.reduce((sum, p) => sum + p.grossSalary, 0)
  const totalCaruman = payrollList.reduce((sum, p) => sum + p.kwsp + p.perkeso + p.eis, 0)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gaji & Payroll</h1>
          <p className="text-gray-500">Urus pembayaran gaji, KWSP, PERKESO dan EIS pekerja anda.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAdding(!isAdding)} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Gaji Custom
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Cetak Laporan
          </Button>
        </div>
      </div>

      {isAdding && (
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Tambah Maklumat Gaji Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select 
                value={selectedPekerjaId}
                onChange={(e) => setSelectedPekerjaId(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Pilih Pekerja</option>
                {pekerjaList.map((p) => (
                  <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                ))}
              </select>
              <Input 
                placeholder="Gaji Kasar (RM)" 
                type="number" 
                className="bg-white" 
                value={grossSalary}
                onChange={(e) => setGrossSalary(e.target.value)}
              />
              <Input 
                placeholder="KWSP (RM)" 
                type="number" 
                className="bg-white" 
                value={kwsp}
                onChange={(e) => setKwsp(e.target.value)}
              />
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Simpan Gaji"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase">Jumlah Gaji Kasar</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM {totalGross.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-gray-500 mt-1">Mac 2026</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase">Jumlah Caruman (KWSP/SOCSO)</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM {totalCaruman.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-emerald-600 mt-1">Sedia untuk dibayar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase">Pekerja Selesai</CardTitle>
            <Plus className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollList.length}/{pekerjaList.length}</div>
            <p className="text-xs text-amber-600 mt-1">{pekerjaList.length - payrollList.length} pekerja belum diproses</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Senarai Payroll - Mac 2026</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input placeholder="Cari pekerja..." className="pl-9 h-9" />
              </div>
              <Button variant="outline" size="sm">Filter</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                <tr>
                  <th className="px-6 py-3">Pekerja</th>
                  <th className="px-6 py-3">Gaji Kasar</th>
                  <th className="px-6 py-3">KWSP (11%)</th>
                  <th className="px-6 py-3">SOCSO/EIS</th>
                  <th className="px-6 py-3">Gaji Bersih</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-600" />
                      <p className="text-xs text-gray-500 mt-2">Memuatkan data sistem...</p>
                    </td>
                  </tr>
                ) : payrollList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Tiada rekod payroll lagi. Sila tambah gaji custom.
                    </td>
                  </tr>
                ) : (
                  payrollList.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{p.employee.firstName} {p.employee.lastName}</p>
                            <p className="text-xs text-gray-500">{p.employee.position}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">RM {p.grossSalary.toFixed(2)}</td>
                      <td className="px-6 py-4 text-gray-600">RM {p.kwsp.toFixed(2)}</td>
                      <td className="px-6 py-4 text-gray-600">RM {(p.perkeso + p.eis).toFixed(2)}</td>
                      <td className="px-6 py-4 font-bold text-indigo-600">RM {p.netSalary.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">{p.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          onClick={() => generatePDF(p)}
                          variant="ghost" 
                          size="sm" 
                          className="text-indigo-600 h-8"
                        >
                          <Download className="mr-1 h-3 w-3" />
                          Papar Slip
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t text-center text-gray-500 text-xs font-medium">
            {payrollList.length} rekod diproses.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
