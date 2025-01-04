import { sendEmailVerification } from "firebase/auth"
import { AlertCircle, CheckCircle2, Clock, Mail } from "lucide-react"
import React, { useState } from "react"

export default function EmailVerification({ user, onVerified }) {
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [error, setError] = useState(null)

  const resendVerificationEmail = async () => {
    setIsResending(true)
    setError(null)
    try {
      await sendEmailVerification(user)
      setResendSuccess(true)
      setTimeout(() => setResendSuccess(false), 5000) // Reset success message after 5s
    } catch (error) {
      setError(error.message)
    } finally {
      setIsResending(false)
    }
  }

  // Check verification status every 5 seconds
  React.useEffect(() => {
    if (!user) return

    const checkVerification = async () => {
      await user.reload()
      if (user.emailVerified) {
        onVerified()
      }
    }

    const interval = setInterval(checkVerification, 5000)
    return () => clearInterval(interval)
  }, [user, onVerified])

  return (
    <div className="min-h-[400px] w-[400px] bg-gray-900 text-slate-100 flex items-center justify-center">
      <div className="w-80 p-6 backdrop-blur-sm bg-slate-900/50 rounded-xl border border-slate-600/50 shadow-2xl">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <Mail className="w-16 h-16 text-emerald-400" />
              <Clock className="w-6 h-6 text-emerald-400 absolute -bottom-1 -right-1" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold">Verify your email</h2>

          {/* Email display */}
          <div>
            <p className="text-slate-300 mb-1">
              We sent a verification link to:
            </p>
            <p className="font-medium text-emerald-400">{user?.email}</p>
          </div>

          {/* Instructions */}
          <div className="text-sm text-slate-400 space-y-2">
            <p>Click the link in your email to verify your account.</p>
            <p>If you don't see the email, check your spam folder.</p>
          </div>

          {/* Status messages */}
          {resendSuccess && (
            <div className="flex items-center justify-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <span>Verification email sent!</span>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Resend button */}
          <button
            onClick={resendVerificationEmail}
            disabled={isResending}
            className="w-full py-2.5 text-white shadow-xl font-medium bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed">
            {isResending ? "Sending..." : "Resend verification email"}
          </button>
        </div>
      </div>
    </div>
  )
}
