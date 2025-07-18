"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, MessageSquare, Calendar, Star } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function DashboardStats() {
  const { t } = useLanguage()

  const stats = [
    {
      title: t("dashboard.patient_satisfaction"),
      value: "4.2/5",
      change: "+0.3",
      trend: "up",
      icon: Star,
      description: t("dashboard.average_30_days"),
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      title: t("dashboard.feedbacks_received"),
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: MessageSquare,
      description: t("dashboard.this_month"),
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: t("dashboard.reminders_sent"),
      value: "3,456",
      change: "-5%",
      trend: "down",
      icon: Calendar,
      description: t("dashboard.this_week"),
      gradient: "from-green-500 to-green-600",
    },
    {
      title: t("dashboard.active_patients"),
      value: "892",
      change: "+8%",
      trend: "up",
      icon: Users,
      description: t("dashboard.unique_users"),
      gradient: "from-purple-500 to-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={index}
            className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-all"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</CardTitle>
              <div className={`w-8 h-8 bg-gradient-to-r ${stat.gradient} rounded-lg flex items-center justify-center`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs">
                <Badge
                  variant={stat.trend === "up" ? "default" : "secondary"}
                  className={`flex items-center gap-1 ${
                    stat.trend === "up"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  }`}
                >
                  {stat.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {stat.change}
                </Badge>
                <span className="text-gray-500 dark:text-gray-400">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
