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
  Menu
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Kalendar HR", href: "/calendar", icon: Calendar },
  { name: "Pekerja", href: "/employees", icon: Users },
  { name: "Gaji & Payroll", href: "/payroll", icon: CircleDollarSign },
  { name: "Kehadiran", href: "/attendance", icon: Clock },
  { name: "Disiplin", href: "/discipline", icon: ShieldAlert },
  { name: "Tuntutan", href: "/claims", icon: FileText },
  { name: "Tetapan", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r">
      <div className="flex h-16 items-center px-6 border-b">
        <span className="text-xl font-bold text-indigo-600">HR Portal</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
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
    </div>
  )
}
