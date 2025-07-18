"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Calendar, FileText, TrendingUp, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react"

export function DashboardOverview() {
  const stats = [
    {
      title: "Total Patients",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Today's Appointments",
      value: "18",
      change: "3 pending",
      trend: "neutral",
      icon: Calendar,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Prescriptions Issued",
      value: "89",
      change: "This week",
      trend: "up",
      icon: FileText,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Patient Satisfaction",
      value: "4.8/5",
      change: "+0.2",
      trend: "up",
      icon: TrendingUp,
      color: "from-yellow-500 to-orange-500",
    },
  ]

  const recentAppointments = [
    {
      id: "1",
      patient: "John Smith",
      time: "09:00 AM",
      type: "Consultation",
      status: "completed",
    },
    {
      id: "2",
      patient: "Maria Garcia",
      time: "10:30 AM",
      type: "Follow-up",
      status: "completed",
    },
    {
      id: "3",
      patient: "David Johnson",
      time: "02:00 PM",
      type: "Routine Check",
      status: "scheduled",
    },
    {
      id: "4",
      patient: "Sarah Wilson",
      time: "03:30 PM",
      type: "Emergency",
      status: "scheduled",
    },
  ]

  const pendingTasks = [
    { id: "1", task: "Review lab results for Patient #1234", priority: "high" },
    { id: "2", task: "Update prescription for Maria Garcia", priority: "medium" },
    { id: "3", task: "Schedule follow-up for John Smith", priority: "low" },
    { id: "4", task: "Respond to patient feedback", priority: "medium" },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Good morning, Dr. Johnson</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Here's what's happening with your patients today</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</CardTitle>
                <div className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Today's Appointments */}
        <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Today's Appointments
            </CardTitle>
            <CardDescription>Your scheduled appointments for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{appointment.time}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{appointment.patient}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{appointment.type}</p>
                  </div>
                </div>
                <Badge
                  variant={appointment.status === "completed" ? "default" : "secondary"}
                  className={
                    appointment.status === "completed"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  }
                >
                  {appointment.status === "completed" ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <Clock className="h-3 w-3 mr-1" />
                  )}
                  {appointment.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Pending Tasks
            </CardTitle>
            <CardDescription>Items that need your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <p className="text-sm text-gray-900 dark:text-white flex-1">{task.task}</p>
                <Badge
                  variant={
                    task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"
                  }
                >
                  {task.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
