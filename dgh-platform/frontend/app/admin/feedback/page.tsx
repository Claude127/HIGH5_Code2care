"use client"

import { FeedbackReview } from "@/components/feedback-review"
import { AdminLayout } from "@/components/admin-layout"
import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"

export default function AdminFeedbackPage() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return (
    <AdminLayout activeView="feedback">
      <FeedbackReview />
    </AdminLayout>
  )
}
