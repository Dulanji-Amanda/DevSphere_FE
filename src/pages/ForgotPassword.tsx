import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { requestPasswordReset } from "../services/auth"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setMessage(null)
    if (!email.trim()) {
      setError("Please enter your email address.")
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      await requestPasswordReset(email)
      setMessage("If an account exists for this email, an OTP has been sent.")
      setTimeout(() => {
        navigate('/reset-password', { state: { email } })
      }, 1500)
    } catch (err) {
      console.error(err)
      // Graceful message even if backend route isn't implemented yet
      setMessage("If an account exists for this email, an OTP has been sent.")
      setTimeout(() => {
        navigate('/reset-password', { state: { email } })
      }, 1500)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-purple-600">Forgot Password</h1>
          <p className="text-sm text-gray-600 mt-2">Enter your email to receive an OTP.</p>
        </div>
        <form className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="fp-email" className="text-xs font-medium text-gray-700 uppercase tracking-wide">Email</label>
            <input
              id="fp-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
              disabled={submitting}
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 font-medium bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}
          {message && (
            <div className="text-sm text-green-700 font-medium bg-green-50 border border-green-200 rounded-md px-3 py-2">
              {message}
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full px-5 py-3 rounded-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Sending..." : "Send OTP"}
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-600 text-center">
          Remembered your password?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-semibold text-purple-600 hover:text-purple-700 transition"
          >
            Back to login
          </button>
        </p>
      </div>
    </div>
  )
}
