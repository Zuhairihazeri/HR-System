"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Building2, Lock, User, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Form State
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email atau kata laluan tidak sah. Sila cuba lagi.")
        setLoading(false)
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      setError("Berlaku ralat teknikal. Sila cuba sebentar lagi.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50/50 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />

      <div className="w-full max-w-md px-4 relative">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 mb-4 transform transition-transform hover:scale-105">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">HR Management</h1>
          <p className="text-gray-500 mt-2 text-center">Sistem Pengurusan Korporat</p>
        </div>

        <Card className="border-none shadow-xl shadow-gray-200/50 overflow-hidden bg-white/80 backdrop-blur-xl">
          <CardHeader className="space-y-1 pt-8">
            <CardTitle className="text-2xl font-bold text-center">Log Masuk</CardTitle>
            <CardDescription className="text-center">
              Masukkan butiran anda untuk mengakses dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8 pt-4">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Admin</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="admin@hrmanagement.com" 
                      className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Kata Laluan</Label>
                    <button type="button" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Lupa kata laluan?</button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-rose-50 text-rose-600 text-xs font-semibold p-3 rounded-lg border border-rose-100 animate-in fade-in slide-in-from-top-1">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Log Masuk 
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-4">Shielded by HR Aegis</p>
              <div className="flex justify-center gap-4 text-gray-300">
                <div className="h-1 w-12 bg-gray-100 rounded-full" />
                <div className="h-1 w-4 bg-indigo-200 rounded-full" />
                <div className="h-1 w-12 bg-gray-100 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
