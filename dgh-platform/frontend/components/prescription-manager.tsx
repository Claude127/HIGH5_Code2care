"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Plus, Search, Calendar, Pill, Clock, Edit, Eye, Printer } from "lucide-react"
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
import type { Ordonnance, Medication, Patient, Appointment } from "@/types/medical"

export function PrescriptionManager() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isNewPrescriptionOpen, setIsNewPrescriptionOpen] = useState(false)
  const [selectedMedications, setSelectedMedications] = useState<any[]>([])

  // Mock data
  const medications: Medication[] = [
    {
      medication_id: "MED001",
      name: "Aspirin",
      dosage: "100mg",
      frequency: 1,
      unit: "tablets",
      instructions: "Take with food",
    },
    {
      medication_id: "MED002",
      name: "Metformin",
      dosage: "500mg",
      frequency: 2,
      unit: "tablets",
      instructions: "Take before meals",
    },
    {
      medication_id: "MED003",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: 1,
      unit: "tablets",
      instructions: "Take in the morning",
    },
  ]

  const ordonnances: (Ordonnance & { patient: Patient; appointment: Appointment })[] = [
    {
      ordonnance_id: "ORD001",
      appointment_id: "APT001",
      patient_id: "PAT001",
      professional_id: "PROF001",
      date: "2024-01-20",
      notes: "Follow-up in 2 weeks",
      prescriptions: [
        {
          prescription_id: "PRES001",
          ordonnance_id: "ORD001",
          medication_id: "MED001",
          start_date: "2024-01-20",
          end_date: "2024-02-20",
          instructions: "Take one tablet daily with breakfast",
          dosage: "100mg",
          frequency: "Once daily",
        },
      ],
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
      ordonnance_id: "ORD002",
      appointment_id: "APT002",
      patient_id: "PAT002",
      professional_id: "PROF001",
      date: "2024-01-19",
      notes: "Monitor blood pressure",
      prescriptions: [
        {
          prescription_id: "PRES002",
          ordonnance_id: "ORD002",
          medication_id: "MED002",
          start_date: "2024-01-19",
          end_date: "2024-04-19",
          instructions: "Take twice daily before meals",
          dosage: "500mg",
          frequency: "Twice daily",
        },
        {
          prescription_id: "PRES003",
          ordonnance_id: "ORD002",
          medication_id: "MED003",
          start_date: "2024-01-19",
          end_date: "2024-07-19",
          instructions: "Take once daily in the morning",
          dosage: "10mg",
          frequency: "Once daily",
        },
      ],
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
  ]

  const addMedication = () => {
    setSelectedMedications([
      ...selectedMedications,
      {
        medication_id: "",
        dosage: "",
        frequency: "",
        instructions: "",
        start_date: "",
        end_date: "",
      },
    ])
  }

  const removeMedication = (index: number) => {
    setSelectedMedications(selectedMedications.filter((_, i) => i !== index))
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Prescription Manager</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Create and manage patient prescriptions and ordonnances
          </p>
        </div>

        <Dialog open={isNewPrescriptionOpen} onOpenChange={setIsNewPrescriptionOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              New Prescription
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Prescription</DialogTitle>
              <DialogDescription>Create a new prescription ordonnance for a patient</DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              {/* Patient Selection */}
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

              {/* Appointment Selection */}
              <div className="grid gap-2">
                <Label htmlFor="appointment">Related Appointment</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select appointment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APT001">Jan 20, 2024 - 09:00 AM</SelectItem>
                    <SelectItem value="APT002">Jan 19, 2024 - 10:30 AM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Medications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Medications</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Medication
                  </Button>
                </div>

                {selectedMedications.map((med, index) => (
                  <Card key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50">
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Medication {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMedication(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Medication</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select medication" />
                            </SelectTrigger>
                            <SelectContent>
                              {medications.map((medication) => (
                                <SelectItem key={medication.medication_id} value={medication.medication_id}>
                                  {medication.name} - {medication.dosage}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label>Frequency</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="once_daily">Once daily</SelectItem>
                              <SelectItem value="twice_daily">Twice daily</SelectItem>
                              <SelectItem value="three_times_daily">Three times daily</SelectItem>
                              <SelectItem value="four_times_daily">Four times daily</SelectItem>
                              <SelectItem value="as_needed">As needed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Start Date</Label>
                          <Input type="date" />
                        </div>
                        <div className="grid gap-2">
                          <Label>End Date</Label>
                          <Input type="date" />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label>Instructions</Label>
                        <Textarea placeholder="Special instructions for this medication..." />
                      </div>
                    </div>
                  </Card>
                ))}

                {selectedMedications.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Pill className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No medications added yet</p>
                    <p className="text-sm">Click "Add Medication" to start</p>
                  </div>
                )}
              </div>

              {/* General Notes */}
              <div className="grid gap-2">
                <Label htmlFor="notes">General Notes</Label>
                <Textarea id="notes" placeholder="Additional notes for this prescription..." />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewPrescriptionOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsNewPrescriptionOpen(false)}>Create Prescription</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search prescriptions by patient name or ordonnance ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/60 dark:bg-gray-900/60"
            />
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions List */}
      <div className="grid gap-6">
        {ordonnances.map((ordonnance) => (
          <Card
            key={ordonnance.ordonnance_id}
            className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-all"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                      {ordonnance.patient.first_name[0]}
                      {ordonnance.patient.last_name[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {ordonnance.patient.first_name} {ordonnance.patient.last_name}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {ordonnance.ordonnance_id}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{ordonnance.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{ordonnance.prescriptions.length} medication(s)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-green-50 dark:hover:bg-green-900/20">
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-orange-50 dark:hover:bg-orange-900/20">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Medications */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Prescribed Medications:</h4>
                {ordonnance.prescriptions.map((prescription, index) => {
                  const medication = medications.find((m) => m.medication_id === prescription.medication_id)
                  return (
                    <div
                      key={prescription.prescription_id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                          <Pill className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {medication?.name} - {prescription.dosage}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {prescription.frequency} • {prescription.instructions}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {prescription.start_date} to {prescription.end_date}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Notes */}
              {ordonnance.notes && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Notes:</strong> {ordonnance.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {ordonnances.length === 0 && (
        <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No prescriptions found</h3>
            <p className="text-gray-600 dark:text-gray-300">Create your first prescription to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
