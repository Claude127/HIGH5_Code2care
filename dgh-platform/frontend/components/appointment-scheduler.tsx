"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  User,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import type { Appointment, Patient } from "@/types/medical"

export function AppointmentScheduler() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)

  // Mock data
  const appointments: (Appointment & { patient: Patient })[] = [
    {
      appointment_id: "APT001",
      patient_id: "PAT001",
      professional_id: "PROF001",
      scheduled_date: "2024-01-20",
      scheduled_time: "09:00",
      status: "scheduled",
      type: "consultation",
      duration: 30,
      notes: "Regular checkup",
      patient: {
        patient_id: "PAT001",
        first_name: "John",
        last_name: "Smith",
        phone_number: "+1234567890",
        preferred_language: "en",
        preferred_contact_method: "sms",
        gender: "male",
        date_of_birth: "1985-06-15",
        email: "john.smith@email.com",
      },
    },
    {
      appointment_id: "APT002",
      patient_id: "PAT002",
      professional_id: "PROF001",
      scheduled_date: "2024-01-20",
      scheduled_time: "10:30",
      status: "completed",
      type: "follow_up",
      duration: 45,
      notes: "Follow-up after surgery",
      patient: {
        patient_id: "PAT002",
        first_name: "Maria",
        last_name: "Garcia",
        phone_number: "+1234567891",
        preferred_language: "fr",
        preferred_contact_method: "call",
        gender: "female",
        date_of_birth: "1990-03-22",
        email: "maria.garcia@email.com",
      },
    },
    {
      appointment_id: "APT003",
      patient_id: "PAT003",
      professional_id: "PROF001",
      scheduled_date: "2024-01-20",
      scheduled_time: "14:00",
      status: "scheduled",
      type: "routine_check",
      duration: 30,
      notes: "Annual physical examination",
      patient: {
        patient_id: "PAT003",
        first_name: "David",
        last_name: "Johnson",
        phone_number: "+1234567892",
        preferred_language: "en",
        preferred_contact_method: "email",
        gender: "male",
        date_of_birth: "1978-11-08",
        email: "david.johnson@email.com",
      },
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "no_show":
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      default:
        return <Clock className="h-4 w-4 text-blue-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: {
        label: "Scheduled",
        variant: "default" as const,
        className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      },
      completed: {
        label: "Completed",
        variant: "default" as const,
        className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      },
      cancelled: {
        label: "Cancelled",
        variant: "destructive" as const,
        className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      },
      no_show: {
        label: "No Show",
        variant: "secondary" as const,
        className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      },
    }
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled
  }

  const getTypeLabel = (type: string) => {
    const types = {
      consultation: "Consultation",
      follow_up: "Follow-up",
      emergency: "Emergency",
      routine_check: "Routine Check",
    }
    return types[type as keyof typeof types] || type
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Appointment Scheduler</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage and schedule patient appointments</p>
        </div>

        <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>Create a new appointment for a patient</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="patient">Patient</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAT001">John Smith</SelectItem>
                    <SelectItem value="PAT002">Maria Garcia</SelectItem>
                    <SelectItem value="PAT003">David Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Appointment Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="follow_up">Follow-up</SelectItem>
                    <SelectItem value="routine_check">Routine Check</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Additional notes..." />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewAppointmentOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsNewAppointmentOpen(false)}>Schedule Appointment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search appointments by patient name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/60 dark:bg-gray-900/60"
              />
            </div>
            <div className="flex gap-2">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white/60 dark:bg-gray-900/60"
              />
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div className="grid gap-6">
        {appointments.map((appointment) => {
          const statusBadge = getStatusBadge(appointment.status)

          return (
            <Card
              key={appointment.appointment_id}
              className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-all"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                        {appointment.patient.first_name[0]}
                        {appointment.patient.last_name[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {appointment.patient.first_name} {appointment.patient.last_name}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {appointment.appointment_id}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{appointment.scheduled_date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.scheduled_time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{getTypeLabel(appointment.type)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{appointment.patient.phone_number}</span>
                        </div>
                      </div>

                      {appointment.notes && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{appointment.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={statusBadge.className}>
                      {getStatusIcon(appointment.status)}
                      <span className="ml-1">{statusBadge.label}</span>
                    </Badge>

                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {appointments.length === 0 && (
        <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No appointments found</h3>
            <p className="text-gray-600 dark:text-gray-300">Schedule your first appointment to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
