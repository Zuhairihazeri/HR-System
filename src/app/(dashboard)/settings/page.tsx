"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Bell, Shield, Palette, Save, Loader2, Users, Plus, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCompanySettings, updateCompanySettings } from "@/lib/actions/modules"
import { getUsers, createUser, updateUser, deleteUser } from "@/lib/actions/users"
import { useSession } from "next-auth/react"

export default function SettingsPage() {
  const { data: session } = useSession()
  const isAdminUser = (session?.user as any)?.role === "ADMIN"
  
  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Company Form State
  const [company, setCompany] = useState<any>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [regNo, setRegNo] = useState("")
  const [address, setAddress] = useState("")

  // Users State
  const [users, setUsers] = useState<any[]>([])
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  
  // User Form State
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [userRole, setUserRole] = useState("USER")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [companyRes, usersRes] = await Promise.all([
          getCompanySettings(),
          isAdminUser ? getUsers() : Promise.resolve([])
        ])
        
        if (companyRes) {
          setCompany(companyRes)
          setName(companyRes.name)
          setEmail(companyRes.email || "")
          setRegNo(companyRes.regNo || "")
          setAddress(companyRes.address || "")
        }
        
        setUsers(usersRes)
      } catch (err) {
        console.error("Failed to fetch settings:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [isAdminUser])

  const handleSaveCompany = async () => {
    if (!company) return
    setSaving(true)
    try {
      await updateCompanySettings(company.id, {
        name,
        email,
        regNo,
        address
      })
      alert("Tetapan berjaya disimpan!")
    } catch (error) {
      console.error("Failed to update settings:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveUser = async () => {
    setSaving(true)
    try {
      if (editingUserId) {
        await updateUser(editingUserId, {
          name: userName,
          email: userEmail,
          password: userPassword || undefined,
          role: userRole
        })
      } else {
        await createUser({
          name: userName,
          email: userEmail,
          password: userPassword,
          role: userRole
        })
      }
      
      const updatedUsers = await getUsers()
      setUsers(updatedUsers)
      resetUserForm()
    } catch (error) {
      console.error("Failed to save user:", error)
      alert("Gagal menyimpan pengguna.")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Adakah anda pasti mahu memadam pengguna ini?")) return
    try {
      await deleteUser(id)
      setUsers(users.filter(u => u.id !== id))
    } catch (error) {
      console.error("Failed to delete user:", error)
    }
  }

  const handleEditUser = (user: any) => {
    setEditingUserId(user.id)
    setUserName(user.name || "")
    setUserEmail(user.email)
    setUserPassword("")
    setUserRole(user.role)
    setIsAddingUser(true)
  }

  const resetUserForm = () => {
    setIsAddingUser(false)
    setEditingUserId(null)
    setUserName("")
    setUserEmail("")
    setUserPassword("")
    setUserRole("USER")
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Memuatkan tetapan sistem...</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tetapan Sistem</h1>
        <p className="text-gray-500">Urus profil syarikat, pengguna, dan konfigurasi HR Management anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <nav className="space-y-1">
            <Button 
              variant="ghost" 
              onClick={() => setActiveTab("profile")}
              className={`w-full justify-start ${activeTab === "profile" ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-gray-600"}`}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Profil Syarikat
            </Button>
            {isAdminUser && (
              <Button 
                variant="ghost" 
                onClick={() => setActiveTab("users")}
                className={`w-full justify-start ${activeTab === "users" ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-gray-600"}`}
              >
                <Users className="mr-2 h-4 w-4" />
                Pengurusan Pengguna
              </Button>
            )}
            <Button variant="ghost" className="w-full justify-start text-gray-600">
              <Bell className="mr-2 h-4 w-4" />
              Notifikasi
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-600">
              <Shield className="mr-2 h-4 w-4" />
              Keselamatan
            </Button>
          </nav>
        </div>

        <div className="md:col-span-2 space-y-6">
          {activeTab === "profile" && (
            <>
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-lg">Profil Syarikat</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Nama Syarikat</Label>
                      <Input 
                        id="company-name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-no">No. Pendaftaran (SSM)</Label>
                      <Input 
                        id="reg-no" 
                        value={regNo}
                        onChange={(e) => setRegNo(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Rasmi</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat Pejabat</Label>
                    <textarea 
                      id="address" 
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-lg">Simpan Perubahan</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveCompany}
                      disabled={saving}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Simpan Tetapan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "users" && isAdminUser && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Senarai Pengguna Sistem</h3>
                <Button onClick={() => setIsAddingUser(true)} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Pengguna
                </Button>
              </div>

              {isAddingUser && (
                <Card className="border-emerald-200 bg-emerald-50/50">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      {editingUserId ? "Kemaskini Pengguna" : "Daftar Pengguna Baru"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nama</Label>
                        <Input value={userName} onChange={e => setUserName(e.target.value)} placeholder="Nama Penuh" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={userEmail} onChange={e => setUserEmail(e.target.value)} type="email" placeholder="email@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label>Kata Laluan {editingUserId && "(Tinggalkan kosong jika tidak mahu tukar)"}</Label>
                        <Input value={userPassword} onChange={e => setUserPassword(e.target.value)} type="password" placeholder="••••••••" />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <select 
                          value={userRole} 
                          onChange={e => setUserRole(e.target.value)}
                          className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm"
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="ghost" onClick={resetUserForm}>Batal</Button>
                      <Button 
                        onClick={handleSaveUser}
                        disabled={saving}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Simpan Pengguna"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                        <tr>
                          <th className="px-6 py-3">Nama</th>
                          <th className="px-6 py-3">Email</th>
                          <th className="px-6 py-3">Role</th>
                          <th className="px-6 py-3 text-right">Tindakan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{u.name || "N/A"}</td>
                            <td className="px-6 py-4 text-gray-500">{u.email}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                u.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditUser(u)} className="h-8 w-8 text-indigo-600">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="h-8 w-8 text-rose-600"
                                  disabled={u.email === session?.user?.email}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
