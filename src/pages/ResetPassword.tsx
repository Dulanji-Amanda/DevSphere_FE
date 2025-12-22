import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { resetPassword, verifyOtp } from "../services/auth"
import OtpInput from "../components/OtpInput"

export default function ResetPassword() {
    const [step, setStep] = useState<"otp" | "password">("otp")
    const [otp, setOtp] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email || ""

    useEffect(() => {
        if (!email) {
            setError("Email is missing. Please try the forgot password process again.")
        }
    }, [email])

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage(null)
        setError(null)

        if (!email) {
            setError("Email is missing. Please restart the process.")
            return
        }
        if (otp.length !== 6) {
            setError("OTP must be 6 digits.")
            return
        }

        setSubmitting(true)
        try {
            await verifyOtp(email, otp)
            setMessage(null)
            setStep("password")
        } catch (err) {
            console.error(err)
            setError("Invalid or expired OTP.")
        } finally {
            setSubmitting(false)
        }
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage(null)
        setError(null)

        if (password.length < 8) {
            setError("Password must be at least 8 characters.")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        setSubmitting(true)
        try {
            await resetPassword(email, otp, password)
            setMessage("Password reset successfully. You can now login.")
            setTimeout(() => navigate('/login'), 2000)
        } catch (err) {
            console.error(err)
            setError("Failed to reset password. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-md p-8">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-purple-600">
                        {step === "otp" ? "Verify OTP" : "Reset Password"}
                    </h1>
                    <p className="text-sm text-gray-600 mt-2">
                        {step === "otp"
                            ? <span>Enter the OTP sent to <strong>{email}</strong></span>
                            : "Enter your new password below."
                        }
                    </p>
                </div>

                {step === "otp" ? (
                    <form className="space-y-6" onSubmit={handleVerifyOtp}>
                        <div className="space-y-4">
                            <label className="text-xs font-medium text-gray-700 uppercase tracking-wide block text-center">OTP Code</label>
                            <OtpInput
                                value={otp}
                                onChange={setOtp}
                                disabled={submitting}
                            />
                        </div>
                        {error && (
                            <div className="text-sm text-center text-red-600 font-medium bg-red-50 border border-red-200 rounded-md px-3 py-2">
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full px-5 py-3 rounded-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>
                ) : (
                    <form className="space-y-4" onSubmit={handleResetPassword}>
                        <div className="space-y-1">
                            <label htmlFor="rp-password" className="text-xs font-medium text-gray-700 uppercase tracking-wide">New Password</label>
                            <input
                                id="rp-password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                                disabled={submitting}
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="rp-confirm-password" className="text-xs font-medium text-gray-700 uppercase tracking-wide">Confirm Password</label>
                            <input
                                id="rp-confirm-password"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                            type="submit"
                            disabled={submitting}
                            className="w-full px-5 py-3 rounded-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}

                <p className="mt-6 text-sm text-gray-600 text-center">
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
