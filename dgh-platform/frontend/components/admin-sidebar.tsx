"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutDashboard, Users, Calendar, FileText, MessageSquare, LogOut, Stethoscope, Settings } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface AdminSidebarProps {
  activeView: string
  setActiveView: (view: "overview" | "patients" | "appointments" | "prescriptions" | "feedback") => void
}

export function AdminSidebar({ activeView, setActiveView }: AdminSidebarProps) {
  const { professional, logout } = useAuth()
  const router = useRouter()

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { id: "patients", label: "Patients", icon: Users, href: "/admin/patients" },
    { id: "appointments", label: "Appointments", icon: Calendar, href: "/admin/appointments" },
    { id: "prescriptions", label: "Prescriptions", icon: FileText, href: "/admin/prescriptions" },
    { id: "feedback", label: "Patient Feedback", icon: MessageSquare, href: "/admin/feedback" },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-r border-white/20 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MedAdmin
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Professional Dashboard</p>
          </div>
        </div>

        {/* Professional Info */}
        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              {professional?.first_name[0]}
              {professional?.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {professional?.first_name} {professional?.last_name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{professional?.specialization}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id

          return (
            <Link key={item.id} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 h-12 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                }`}
                onClick={() => setActiveView(item.id as any)}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/20 space-y-2">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <ThemeToggle />
        </div>

        <Button
          variant="outline"
          className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 bg-transparent"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
