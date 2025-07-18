"use client"

import { DashboardStats } from "@/components/dashboard-stats"
import { FeedbackAnalytics } from "@/components/feedback-analytics"
import { ReminderMetrics } from "@/components/reminder-metrics"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Filter, Sparkles } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"

export default function DashboardPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-sm bg-white/10 dark:bg-gray-900/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" className="gap-2 hover:bg-white/20 dark:hover:bg-gray-800/20">
                  <ArrowLeft className="h-4 w-4" />
                  {t("common.back")}
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent">
                  {t("dashboard.title")}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <Filter className="h-4 w-4" />
                  {t("dashboard.filters")}
                </Button>
                <Button className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  <Download className="h-4 w-4" />
                  {t("dashboard.export")}
                </Button>
              </div>
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <DashboardStats />
          <div className="grid lg:grid-cols-2 gap-8">
            <FeedbackAnalytics />
            <ReminderMetrics />
          </div>
        </div>
      </div>
    </div>
  )
}
