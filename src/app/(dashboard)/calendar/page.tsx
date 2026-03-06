"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createCalendarEvent, getCalendarEvents } from "@/lib/actions/modules"
import { useSession } from "next-auth/react"

export default function CalendarPage() {
  const { data: session } = useSession()
  const isAdmin = (session?.user as any)?.role === "ADMIN"
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [events, setEvents] = useState<any[]>([])
  const [isAdding, setIsAdding] = useState(false)

  // Form State
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [type, setType] = useState("EVENT")

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      const res = await getCalendarEvents()
      setEvents(res)
      setLoading(false)
    }
    fetchEvents()
  }, [])

  const handleSave = async () => {
    if (!title || !date) return
    setSaving(true)
    try {
      await createCalendarEvent({
        title,
        date: new Date(date),
        type
      })
      const updated = await getCalendarEvents()
      setEvents(updated)
      setIsAdding(false)
      setTitle("")
      setDate("")
    } catch (error) {
      console.error("Failed to save event:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kalendar HR</h1>
          <p className="text-gray-500">Urus acara, cuti, dan peringatan syarikat anda.</p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button onClick={() => setIsAdding(!isAdding)} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Acara
            </Button>
          )}
        </div>
      </div>

      {isAdding && isAdmin && (
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Rekod Acara Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input 
                placeholder="Tajuk Acara" 
                className="bg-white" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input 
                type="date"
                className="bg-white" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm"
              >
                <option value="EVENT">ACARA AM</option>
                <option value="BIRTHDAY">HARI LAHIR</option>
                <option value="DEADLINE">TARIKH AKHIR</option>
              </select>
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Simpan Acara"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Visual */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-indigo-600" />
              Mac 2026
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-8"><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" className="h-8"><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-7 border-b bg-gray-50 text-center py-2 text-xs font-semibold text-gray-500">
              {["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 h-[500px]">
              {Array.from({ length: 35 }).map((_, i) => {
                const day = i - 6 // Mac 2026 starts on Sunday (day 1)
                const currentEvents = events.filter(e => new Date(e.date).getDate() === day && new Date(e.date).getMonth() === 2)
                
                return (
                  <div key={i} className="border-r border-b p-2 last:border-r-0 hover:bg-gray-50 transition-colors overflow-hidden">
                    {day > 0 && day <= 31 && (
                      <>
                        <span className="text-xs text-gray-400 font-medium">{day}</span>
                        <div className="mt-1 space-y-1">
                          {currentEvents.map(e => (
                            <div key={e.id} className={`p-1 text-[9px] rounded border truncate ${
                              e.type === 'BIRTHDAY' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                              e.type === 'DEADLINE' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                              'bg-indigo-50 text-indigo-700 border-indigo-100'
                            }`}>
                              {e.title}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming List */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Senarai Acara</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {loading ? (
              <div className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-600" /></div>
            ) : events.length === 0 ? (
              <p className="text-center text-xs text-gray-500 py-8">Tiada acara berdaftar.</p>
            ) : (
              events.map(e => (
                <div key={e.id} className="flex gap-3 items-start p-2 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                    e.type === 'BIRTHDAY' ? 'bg-rose-500' :
                    e.type === 'DEADLINE' ? 'bg-amber-500' :
                    'bg-indigo-500'
                  }`} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{e.title}</p>
                    <p className="text-xs text-gray-500">{new Date(e.date).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long' })}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
