"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Professional } from "@/types/medical"

interface AuthContextType {
  professional: Professional | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock professional data
const mockProfessional: Professional = {
  professional_id: "PROF001",
  first_name: "Dr. Sarah",
  last_name: "Johnson",
  date_of_birth: "1985-03-15",
  gender: "female",
  specialization: "Cardiology",
  department_id: "DEPT001",
  email: "dr.johnson@hospital.com",
  phone: "+1234567890",
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const savedProfessional = localStorage.getItem("professional")
    if (savedProfessional) {
      setProfessional(JSON.parse(savedProfessional))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Mock authentication - in real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email === "doctor@hospital.com" && password === "password") {
      setProfessional(mockProfessional)
      localStorage.setItem("professional", JSON.stringify(mockProfessional))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setProfessional(null)
    localStorage.removeItem("professional")
  }

  return (
    <AuthContext.Provider
      value={{
        professional,
        login,
        logout,
        isAuthenticated: !!professional,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
