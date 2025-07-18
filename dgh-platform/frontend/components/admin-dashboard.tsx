"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { DashboardOverview } from "@/components/dashboard-overview"
import { PatientManagement } from "@/components/patient-management"
import { AppointmentScheduler } from "@/components/appointment-scheduler"
import { PrescriptionManager } from "@/components/prescription-manager"
import { FeedbackReview } from "@/components/feedback-review"
import { SidebarProvider } from "@/components/ui/sidebar"

type ActiveView = "overview" | "patients" | "appointments" | "prescriptions" | "feedback"

export function AdminDashboard() {
  const [activeView, setActiveView] = useState<ActiveView>("overview")

  const renderActiveView = () => {
    switch (activeView) {
      case "overview":
        return <DashboardOverview />
      case "patients":
        return <PatientManagement />
      case "appointments":
        return <AppointmentScheduler />
      case "prescriptions":
        return <PrescriptionManager />
      case "feedback":
        return <FeedbackReview />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
        <AdminSidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="pl-64">{renderActiveView()}</main>
      </div>
    </SidebarProvider>
  )
}
