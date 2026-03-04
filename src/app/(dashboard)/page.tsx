import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, Clock, ShieldAlert, Plus, Printer, History, AlertCircle, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Selamat Pagi, Zek Management</h1>
        <p className="text-gray-500">Berikut adalah ringkasan untuk syarikat anda hari ini.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-indigo-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Jumlah Pekerja</CardTitle>
            <Users className="h-4 w-4 opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs opacity-70">+4 dari bulan lepas</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Kos Gaji (Bulan Ini)</CardTitle>
            <CreditCard className="h-4 w-4 opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM 452,100</div>
            <p className="text-xs opacity-70">Sedia untuk dibayar</p>
          </CardContent>
        </Card>
        <Card className="bg-sky-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Purata Kehadiran</CardTitle>
            <Clock className="h-4 w-4 opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs opacity-70">8 pekerja lewat hari ini</p>
          </CardContent>
        </Card>
        <Card className="bg-rose-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Teguran Aktif</CardTitle>
            <ShieldAlert className="h-4 w-4 opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs opacity-70">Perlukan tindakan segera</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Salary Cost Summary */}
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
                    <p className="text-lg font-semibold">RM 380,000</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">KWSP</p>
                    <p className="text-lg font-semibold">RM 49,400</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">PERKESO</p>
                    <p className="text-lg font-semibold">RM 18,200</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">EIS</p>
                    <p className="text-lg font-semibold">RM 4,500</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 rounded-md text-sm border border-amber-100">
                  <AlertCircle className="h-4 w-4" />
                  <span>7 pekerja belum ada konfigurasi gaji. Sila lengkapkan maklumat mereka.</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-24 flex flex-col gap-2 bg-white">
              <Plus className="h-6 w-6 text-indigo-600" />
              <span className="text-xs font-medium">Tambah Pekerja</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 bg-white">
              <FileText className="h-6 w-6 text-emerald-600" />
              <span className="text-xs font-medium">Jana Slip Gaji</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 bg-white">
              <Clock className="h-6 w-6 text-sky-600" />
              <span className="text-xs font-medium">Input Kehadiran</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 bg-white">
              <ShieldAlert className="h-6 w-6 text-rose-600" />
              <span className="text-xs font-medium">Tambah Teguran</span>
            </Button>
          </div>
        </div>

        {/* Side Section: Events/Reminders */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Acara & Peringatan</CardTitle>
              <Button variant="ghost" size="sm" className="text-indigo-600 h-8">Lihat Semua</Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Mesyuarat KPI Suku Pertama</p>
                  <p className="text-xs text-gray-500">Esok, 10:00 AM</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded bg-rose-50 flex items-center justify-center text-rose-600 flex-shrink-0">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Hari Lahir Ahmad Fauzi</p>
                  <p className="text-xs text-gray-500">6 Mac 2026</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Hantar Laporan KWSP</p>
                  <p className="text-xs text-gray-500">15 Mac 2026</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
