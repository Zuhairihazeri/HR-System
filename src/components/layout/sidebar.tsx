"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  CircleDollarSign, 
  Clock, 
  ShieldAlert, 
  FileText, 
  Settings,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = (session?.user as any)?.role === "ADMIN"

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, show: true },
    { name: "Kalendar HR", href: "/calendar", icon: Calendar, show: true },
    { name: "Pekerja", href: "/pekerja", icon: Users, show: isAdmin },
    { name: "Gaji & Payroll", href: "/payroll", icon: CircleDollarSign, show: isAdmin },
    { name: "Kehadiran", href: "/attendance", icon: Clock, show: true },
    { name: "Disiplin", href: "/discipline", icon: ShieldAlert, show: true },
    { name: "Tuntutan", href: "/claims", icon: FileText, show: true },
    { name: "Tetapan", href: "/settings", icon: Settings, show: isAdmin },
  ]

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r">
      <div className="flex h-16 items-center px-6 border-b">
        <span className="text-xl font-bold text-indigo-600">HR Portal</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.filter(item => item.show).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-indigo-50 text-indigo-600" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn(
                "mr-3 h-5 w-5 flex-shrink-0",
                isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-500"
              )} />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-rose-600 hover:text-rose-700 hover:bg-rose-50"
          onClick={() => signOut()}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Log Keluar
        </Button>
      </div>
    </div>
  )
}
