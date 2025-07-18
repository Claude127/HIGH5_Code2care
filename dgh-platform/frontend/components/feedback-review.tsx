"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Search, Star, Calendar, User, Volume2, Type, CheckCircle, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Feedback, Patient, Appointment } from "@/types/medical"

export function FeedbackReview() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock feedback data
  const feedbacks: (Feedback & { patient: Patient; appointment: Appointment })[] = [
    {
      feedback_id: "FB001",
      patient_id: "PAT001",
      appointment_id: "APT001",
      created_at: "2024-01-20T10:30:00Z",
      input_type: "text",
      rating: 5,
      content:
        "Excellent service! Dr. Johnson was very professional and took time to explain everything clearly. The wait time was minimal and the staff was friendly.",
      status: "reviewed",
      language: "en",
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
      appointment: {
        appointment_id: "APT001",
        patient_id: "PAT001",
        professional_id: "PROF001",
        scheduled_date: "2024-01-20",
        scheduled_time: "09:00",
        status: "completed",
        type: "consultation",
        duration: 30,
        notes: "Regular checkup",
      },
    },
    {
      feedback_id: "FB002",
      patient_id: "PAT002",
      appointment_id: "APT002",
      created_at: "2024-01-19T15:45:00Z",
      input_type: "voice",
      rating: 4,
      content:
        "Bonjour, je suis très satisfaite de ma consultation. Le docteur a été à l'écoute et a bien expliqué mon traitement. Peut-être que l'attente était un peu longue mais sinon tout était parfait.",
      status: "pending",
      language: "fr",
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
      appointment: {
        appointment_id: "APT002",
        patient_id: "PAT002",
        professional_id: "PROF001",
        scheduled_date: "2024-01-19",
        scheduled_time: "10:30",
        status: "completed",
        type: "follow_up",
        duration: 45,
        notes: "Follow-up after surgery",
      },
    },
    {
      feedback_id: "FB003",
      patient_id: "PAT003",
      appointment_id: "APT003",
      created_at: "2024-01-18T14:20:00Z",
      input_type: "rating",
      rating: 3,
      content:
        "The appointment was okay. The doctor was knowledgeable but seemed rushed. I would have liked more time to ask questions about my condition.",
      status: "resolved",
      language: "en",
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
      appointment: {
        appointment_id: "APT003",
        patient_id: "PAT003",
        professional_id: "PROF001",
        scheduled_date: "2024-01-18",
        scheduled_time: "14:00",
        status: "completed",
        type: "routine_check",
        duration: 30,
        notes: "Annual physical examination",
      },
    },
  ]

  const getInputTypeIcon = (type: string) => {
    switch (type) {
      case "voice":
        return <Volume2 className="h-4 w-4 text-purple-600" />
      case "text":
        return <Type className="h-4 w-4 text-blue-600" />
      case "rating":
        return <Star className="h-4 w-4 text-yellow-600" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
        icon: <Clock className="h-3 w-3" />,
      },
      reviewed: {
        label: "Reviewed",
        className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      resolved: {
        label: "Resolved",
        className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        icon: <CheckCircle className="h-3 w-3" />,
      },
    }
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
      />
    ))
  }

  const getSentimentColor = (rating: number) => {
    if (rating >= 4) return "text-green-600 dark:text-green-400"
    if (rating >= 3) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch =
      `${feedback.patient.first_name} ${feedback.patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.feedback_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.content.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || feedback.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Patient Feedback Review</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Review and respond to patient feedback and ratings</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search feedback by patient name, ID, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/60 dark:bg-gray-900/60"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <div className="grid gap-6">
        {filteredFeedbacks.map((feedback) => {
          const statusBadge = getStatusBadge(feedback.status)

          return (
            <Card
              key={feedback.feedback_id}
              className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-all"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                        {feedback.patient.first_name[0]}
                        {feedback.patient.last_name[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {feedback.patient.first_name} {feedback.patient.last_name}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {feedback.feedback_id}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(feedback.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getInputTypeIcon(feedback.input_type)}
                          <span className="capitalize">{feedback.input_type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs">Language:</span>
                          <Badge variant="outline" className="text-xs">
                            {feedback.language.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">{getRatingStars(feedback.rating)}</div>
                      <span className={`font-medium ${getSentimentColor(feedback.rating)}`}>{feedback.rating}/5</span>
                    </div>

                    {/* Status */}
                    <Badge className={statusBadge.className}>
                      {statusBadge.icon}
                      <span className="ml-1">{statusBadge.label}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Feedback Content */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{feedback.content}</p>
                </div>

                {/* Related Appointment Info */}
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>
                      Appointment: {feedback.appointment.scheduled_date} at {feedback.appointment.scheduled_time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Type: {feedback.appointment.type.replace("_", " ")}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {feedback.status === "pending" && (
                    <>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Mark as Reviewed
                      </Button>
                      <Button size="sm" variant="outline">
                        Respond to Patient
                      </Button>
                    </>
                  )}
                  {feedback.status === "reviewed" && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Mark as Resolved
                    </Button>
                  )}
                  <Button size="sm" variant="ghost">
                    View Full Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredFeedbacks.length === 0 && (
        <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No feedback found</h3>
            <p className="text-gray-600 dark:text-gray-300">
              No patient feedback matches your current search criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
