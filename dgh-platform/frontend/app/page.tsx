"use client"

import { LanguageSelector } from "@/components/language-selector"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Calendar, BarChart3, Globe, Sparkles, Shield, Zap, Loader2, Stethoscope } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-blue-950">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <AdminDashboard />
  }

  return <PublicHomePage />
}

function PublicHomePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-sm bg-white/10 dark:bg-gray-900/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MedFeedback
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" className="gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <Stethoscope className="h-4 w-4" />
                Professional Login
              </Button>
            </Link>
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            Secured
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-6 font-poppins">
            {t("app.title")}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t("app.subtitle")}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Real-time Analytics</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full">
              <Globe className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">5 Languages Supported</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Voice & Text Input</span>
            </div>
          </div>
        </div>

        {/* Main Cards */}
        <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto mb-16 px-4">
  <Card className="w-full max-w-md group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:scale-105">
    <CardHeader className="pb-4">
      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <MessageSquare className="h-7 w-7 text-white" />
      </div>
      <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
        {t("home.patient_feedback")}
      </CardTitle>
      <CardDescription className="text-gray-600 dark:text-gray-300">
        {t("home.patient_feedback_desc")}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Link href="/feedback">
        <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all text-base py-6">
          {t("home.give_feedback")}
        </Button>
      </Link>
    </CardContent>
  </Card>

  <Card className="w-full max-w-md group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:scale-105">
    <CardHeader className="pb-4">
      <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Calendar className="h-7 w-7 text-white" />
      </div>
      <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
        {t("home.reminders")}
      </CardTitle>
      <CardDescription className="text-gray-600 dark:text-gray-300">
        {t("home.reminders_desc")}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Link href="/reminders">
        <Button
          variant="outline"
          className="w-full border-2 border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20 transition-all text-base py-6"
        >
          {t("home.my_reminders")}
        </Button>
      </Link>
    </CardContent>
  </Card>
</div>


        {/* Features Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-6 py-3 rounded-full">
            <Globe className="h-5 w-5" />
            <span className="font-medium">{t("home.supported_languages")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
