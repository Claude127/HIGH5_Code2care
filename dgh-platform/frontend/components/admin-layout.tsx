"use client"

import type React from "react"

import { AdminSidebar } from "@/components/admin-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

interface AdminLayoutProps {
  children: React.ReactNode
  activeView: "overview" | "patients" | "appointments" | "prescriptions" | "feedback"
}

export function AdminLayout({ children, activeView }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
        <AdminSidebar activeView={activeView} setActiveView={() => {}} />
        <main className="pl-64">{children}</main>
      </div>
    </SidebarProvider>
  )
}
