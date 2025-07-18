"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Calendar, Clock, Phone, MessageSquare, Pill, Stethoscope, Edit, Trash2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function RemindersList() {
  const { t } = useLanguage()

  const [reminderList, setReminderList] = useState([
    {
      id: 1,
      type: "appointment",
      title: t("reminders.cardiology_appointment"),
      description: t("reminders.followup_consultation"),
      date: "2024-01-20",
      time: "14:30",
      method: "sms",
      language: "en",
      active: true,
      patient: "Marie Dubois",
    },
    {
      id: 2,
      type: "medication",
      title: t("reminders.medication_intake"),
      description: t("reminders.aspirin_tablet"),
      date: "2024-01-18",
      time: "08:00",
      method: "call",
      language: "fr",
      active: true,
      patient: "John Smith",
    },
    {
      id: 3,
      type: "appointment",
      title: t("reminders.blood_test"),
      description: t("reminders.lab_fasting"),
      date: "2024-01-22",
      time: "09:00",
      method: "sms",
      language: "duala",
      active: false,
      patient: "Ngozi Mballa",
    },
  ])

  const toggleReminder = (id: number) => {
    setReminderList((prev) =>
      prev.map((reminder) => (reminder.id === id ? { ...reminder, active: !reminder.active } : reminder)),
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Stethoscope className="h-4 w-4" />
      case "medication":
        return <Pill className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getMethodIcon = (method: string) => {
    return method === "sms" ? <MessageSquare className="h-4 w-4" /> : <Phone className="h-4 w-4" />
  }

  const getLanguageBadge = (language: string) => {
    const languages = {
      fr: t("lang.french"),
      en: t("lang.english"),
      duala: t("lang.duala"),
      bassa: t("lang.bassa"),
      ewondo: t("lang.ewondo"),
    }
    return languages[language as keyof typeof languages] || language
  }

  return (
  <div className="space-y-6">
    {reminderList.map((reminder) => (
      <Card
        key={reminder.id}
        className={`transition-all shadow-sm border border-muted bg-white dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl ${!reminder.active ? "opacity-60" : ""}`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center">
                {getTypeIcon(reminder.type)}
              </div>
              <div>
                <CardTitle className="text-xl font-semibold leading-tight">{reminder.title}</CardTitle>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {getLanguageBadge(reminder.language)}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Switch
                checked={reminder.active}
                onCheckedChange={() => toggleReminder(reminder.id)}
                className="scale-90"
              />
              <Button variant="ghost" size="icon" className="hover:bg-blue-100 dark:hover:bg-blue-900/30">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-red-100 dark:hover:bg-red-900/30">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {reminder.description && (
            <CardDescription className="mt-2 text-sm text-muted-foreground pl-14">
              {reminder.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="pt-2 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{reminder.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{reminder.time}</span>
            </div>
            <div className="flex items-center gap-2">
              {getMethodIcon(reminder.method)}
              <span>
                {reminder.method === "sms"
                  ? t("reminders.sms")
                  : t("reminders.call")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{t("reminders.patient")}:</span>
              <span>{reminder.patient}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}

    {reminderList.length === 0 && (
      <Card className="border border-muted bg-white dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl">
        <CardContent className="text-center py-12">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg font-medium">
            {t("reminders.no_reminders")}
          </p>
        </CardContent>
      </Card>
    )}
  </div>
)

}
