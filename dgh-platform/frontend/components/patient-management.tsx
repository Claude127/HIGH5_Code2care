"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Filter, MoreHorizontal, Phone, Mail, Calendar, User, Edit, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Patient } from "@/types/medical"

export function PatientManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  // Mock patient data
  const patients: Patient[] = [
    {
      patient_id: "PAT001",
      first_name: "John",
      last_name: "Smith",
      phone_number: "+1234567890",
      preferred_language: "en",
      preferred_contact_method: "sms",
      gender: "male",
      date_of_birth: "1985-06-15",
      email: "john.smith@email.com",
      address: "123 Main St, City, State",
    },
    {
      patient_id: "PAT002",
      first_name: "Maria",
      last_name: "Garcia",
      phone_number: "+1234567891",
      preferred_language: "fr",
      preferred_contact_method: "call",
      gender: "female",
      date_of_birth: "1990-03-22",
      email: "maria.garcia@email.com",
      address: "456 Oak Ave, City, State",
    },
    {
      patient_id: "PAT003",
      first_name: "David",
      last_name: "Johnson",
      phone_number: "+1234567892",
      preferred_language: "en",
      preferred_contact_method: "email",
      gender: "male",
      date_of_birth: "1978-11-08",
      email: "david.johnson@email.com",
      address: "789 Pine St, City, State",
    },
    {
      patient_id: "PAT004",
      first_name: "Sarah",
      last_name: "Wilson",
      phone_number: "+1234567893",
      preferred_language: "duala",
      preferred_contact_method: "sms",
      gender: "female",
      date_of_birth: "1995-09-12",
      email: "sarah.wilson@email.com",
      address: "321 Elm St, City, State",
    },
  ]

  const filteredPatients = patients.filter(
    (patient) =>
      `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getLanguageBadge = (language: string) => {
    const languages = {
      en: { label: "English", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
      fr: { label: "Français", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
      duala: { label: "Duala", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
      bassa: { label: "Bassa", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" },
      ewondo: { label: "Ewondo", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300" },
    }
    return languages[language as keyof typeof languages] || languages.en
  }

  const getContactMethodIcon = (method: string) => {
    switch (method) {
      case "sms":
        return <Phone className="h-4 w-4" />
      case "call":
        return <Phone className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      default:
        return <Phone className="h-4 w-4" />
    }
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Patient Management</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your patient records and information</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Patient
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search patients by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/60 dark:bg-gray-900/60"
              />
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patients List */}
      <div className="grid gap-6">
        {filteredPatients.map((patient) => {
          const languageBadge = getLanguageBadge(patient.preferred_language)
          const age = calculateAge(patient.date_of_birth)

          return (
            <Card
              key={patient.patient_id}
              className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-all"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                        {patient.first_name[0]}
                        {patient.last_name[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {patient.first_name} {patient.last_name}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {patient.patient_id}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{age} years old</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getContactMethodIcon(patient.preferred_contact_method)}
                          <span>{patient.phone_number}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{patient.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={languageBadge.color}>{languageBadge.label}</Badge>

                    <Badge variant="outline" className="capitalize">
                      {patient.preferred_contact_method}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit Patient
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Calendar className="h-4 w-4" />
                          Schedule Appointment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredPatients.length === 0 && (
        <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No patients found</h3>
            <p className="text-gray-600 dark:text-gray-300">Try adjusting your search criteria or add a new patient.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
