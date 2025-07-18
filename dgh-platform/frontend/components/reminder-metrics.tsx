"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Phone, MessageSquare, Clock } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function ReminderMetrics() {
  const { t } = useLanguage()

  const reminderStats = [
    {
      type: t("reminders.sms"),
      sent: 1234,
      delivered: 1198,
      success_rate: 97,
      icon: MessageSquare,
      color: "text-blue-600",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      type: t("reminders.call"),
      sent: 567,
      delivered: 523,
      success_rate: 92,
      icon: Phone,
      color: "text-green-600",
      gradient: "from-green-500 to-green-600",
    },
  ]

  const reminderTypes = [
    { type: t("reminder.appointments"), count: 892, percentage: 65 },
    { type: t("reminder.medications"), count: 456, percentage: 33 },
    { type: t("reminder.exams"), count: 123, percentage: 9 },
  ]

  const timeSlots = [
    { time: "08:00-10:00", count: 234, effectiveness: 85 },
    { time: "10:00-12:00", count: 189, effectiveness: 78 },
    { time: "14:00-16:00", count: 156, effectiveness: 82 },
    { time: "16:00-18:00", count: 98, effectiveness: 75 },
  ]

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>{t("dashboard.reminder_effectiveness")}</CardTitle>
          <CardDescription>{t("dashboard.delivery_rate")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {reminderStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 bg-gradient-to-r ${stat.gradient} rounded-lg flex items-center justify-center`}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">{stat.type}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  >
                    {stat.success_rate}% {t("dashboard.success")}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.delivered} {t("dashboard.delivered_out_of")} {stat.sent} {t("dashboard.sent")}
                </div>
                <Progress value={stat.success_rate} className="h-2" />
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>{t("dashboard.reminder_types")}</CardTitle>
          <CardDescription>{t("dashboard.reminders_by_category")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {reminderTypes.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium">{item.type}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{item.count}</span>
                <div className="w-16">
                  <Progress value={item.percentage} className="h-2" />
                </div>
                <span className="text-sm font-medium w-8">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>{t("dashboard.time_slots")}</CardTitle>
          <CardDescription>{t("dashboard.effectiveness_by_time")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {timeSlots.map((slot, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border border-white/20 rounded-lg bg-white/40 dark:bg-gray-700/40"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{slot.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {slot.count} {t("dashboard.reminders")}
                </span>
                <Badge variant={slot.effectiveness > 80 ? "default" : "secondary"}>
                  {slot.effectiveness}% {t("dashboard.effective")}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
