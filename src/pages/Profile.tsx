import React, { useEffect, useState } from "react"
import { useAuth } from "../context/authContext"
import { getMyDetails, updateMyDetails } from "../services/auth"

export default function Profile() {
  const { user, setUser } = useAuth()
  const [email, setEmail] = useState(user?.email ?? "")
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyDetails()
        setUser(res.data)
        setEmail(res.data?.email ?? "")
        setFirstname((res.data as any)?.firstname ?? "")
        setLastname((res.data as any)?.lastname ?? "")
      } catch {}
    })()
  }, [])

  const onSave = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setMessage(null)
    setSaving(true)
    try {
      const res = await updateMyDetails({ email, firstname, lastname })
      setUser(res.data)
      setMessage("Profile updated")
    } catch (err) {
      console.error(err)
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
            <div className="text-sm text-gray-700 font-medium bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
              {message}
            </div>
          )}
          <button
            onClick={onSave}
            disabled={saving}
            className="w-full px-5 py-3 rounded-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  )
}
