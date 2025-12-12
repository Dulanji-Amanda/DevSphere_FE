import React, { useEffect, useState } from "react"
import { useAuth } from "../context/authContext"
import { getMyDetails, updateMyDetails, type UpdateProfilePayload } from "../services/auth"
import BackButton from "../components/BackButton"

export default function Profile() {
  const { user, setUser } = useAuth()
  const [email, setEmail] = useState(user?.email ?? "")
  const [firstname, setFirstname] = useState(user?.firstname ?? "")
  const [lastname, setLastname] = useState(user?.lastname ?? "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyDetails()
        setUser(res.data)
      } catch (err) {
        console.error(err)
      }
    })()
  }, [setUser])

  useEffect(() => {
    if (!user) return
    setEmail(user.email ?? "")
    setFirstname(user.firstname ?? "")
    setLastname(user.lastname ?? "")
  }, [user])

  const onSave = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setMessage(null)
    setMessageType(null)
    setSaving(true)
    try {
      const payload: UpdateProfilePayload = { email, firstname, lastname }
      const wantsPasswordChange = currentPassword || newPassword || confirmPassword

      if (wantsPasswordChange) {
        if (!currentPassword || !newPassword) {
          setMessageType("error")
          setMessage("Enter your current and new passwords")
          setSaving(false)
          return
        }
        if (newPassword !== confirmPassword) {
          setMessageType("error")
          setMessage("New password and confirmation must match")
          setSaving(false)
          return
        }
        payload.currentPassword = currentPassword
        payload.newPassword = newPassword
      }

      const res = await updateMyDetails(payload)
      setUser(res.data)
      setMessageType("success")
      setMessage(payload.newPassword ? "Profile and password updated" : "Profile updated")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      console.error(err)
      setMessageType("error")
      setMessage("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-md p-8">
        <h1 className="text-3xl font-bold mb-4 text-purple-600 text-center">Your Profile</h1>
        <form className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="pf-email" className="text-xs font-medium text-gray-700 uppercase tracking-wide">Email</label>
            <input
              id="pf-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="pf-firstname" className="text-xs font-medium text-gray-700 uppercase tracking-wide">First Name</label>
            <input
              id="pf-firstname"
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="pf-lastname" className="text-xs font-medium text-gray-700 uppercase tracking-wide">Last Name</label>
            <input
              id="pf-lastname"
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
            />
          </div>
          {message && (
            <div
              className={`text-sm font-medium rounded-md px-3 py-2 border ${
                messageType === "error"
                  ? "text-red-700 bg-red-50 border-red-200"
                  : "text-green-700 bg-green-50 border-green-200"
              }`}
            >
              {message}
            </div>
          )}
          <div className="space-y-1">
            <label htmlFor="pf-current" className="text-xs font-medium text-gray-700 uppercase tracking-wide">
              Current Password
            </label>
            <div className="relative">
              <input
                id="pf-current"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full px-4 py-2.5 pr-12 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  {showCurrentPassword ? (
                    <>
                      <path d="M3 3l18 18" />
                      <path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58" />
                      <path d="M9.88 4.24A10.94 10.94 0 0112 4c5 0 9.27 3.11 10.5 7.5a11.25 11.25 0 01-2.1 3.82" />
                      <path d="M6.18 6.18A11 11 0 001.5 11.5 11.25 11.25 0 003 15" />
                    </>
                  ) : (
                    <>
                      <path d="M1.5 11.5C2.73 7.11 7 4 12 4s9.27 3.11 10.5 7.5C21.27 15.89 17 19 12 19S2.73 15.89 1.5 11.5z" />
                      <circle cx="12" cy="11.5" r="2.5" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="pf-new" className="text-xs font-medium text-gray-700 uppercase tracking-wide">
              New Password
            </label>
            <div className="relative">
              <input
                id="pf-new"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full px-4 py-2.5 pr-12 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showNewPassword ? "Hide new password" : "Show new password"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  {showNewPassword ? (
                    <>
                      <path d="M3 3l18 18" />
                      <path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58" />
                      <path d="M9.88 4.24A10.94 10.94 0 0112 4c5 0 9.27 3.11 10.5 7.5a11.25 11.25 0 01-2.1 3.82" />
                      <path d="M6.18 6.18A11 11 0 001.5 11.5 11.25 11.25 0 003 15" />
                    </>
                  ) : (
                    <>
                      <path d="M1.5 11.5C2.73 7.11 7 4 12 4s9.27 3.11 10.5 7.5C21.27 15.89 17 19 12 19S2.73 15.89 1.5 11.5z" />
                      <circle cx="12" cy="11.5" r="2.5" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="pf-confirm" className="text-xs font-medium text-gray-700 uppercase tracking-wide">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="pf-confirm"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full px-4 py-2.5 pr-12 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  {showConfirmPassword ? (
                    <>
                      <path d="M3 3l18 18" />
                      <path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58" />
                      <path d="M9.88 4.24A10.94 10.94 0 0112 4c5 0 9.27 3.11 10.5 7.5a11.25 11.25 0 01-2.1 3.82" />
                      <path d="M6.18 6.18A11 11 0 001.5 11.5 11.25 11.25 0 003 15" />
                    </>
                  ) : (
                    <>
                      <path d="M1.5 11.5C2.73 7.11 7 4 12 4s9.27 3.11 10.5 7.5C21.27 15.89 17 19 12 19S2.73 15.89 1.5 11.5z" />
                      <circle cx="12" cy="11.5" r="2.5" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
          <button
            onClick={onSave}
            disabled={saving}
            className="w-full px-5 py-3 rounded-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
      <BackButton />
    </div>
  )
}
