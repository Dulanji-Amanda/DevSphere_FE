import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { register, type RegisterResponse } from "../services/auth"

export default function Register() {
  const [username, setUsername] = useState("")
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!username || !password || !firstname || !lastname) {
      setError("Please fill in all fields.")
      return
    }
    setError(null)
    setLoading(true)
    try {
      const data: RegisterResponse = await register(username, password, firstname, lastname)
      alert(`Registration successful! Email: ${data.data.email}`)
      navigate("/login")
    } catch (err: unknown) {
      console.error("Registration error:", err)
      setError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-purple-600">Create Account</h1>
          <p className="text-sm text-gray-600 mt-2">Join DevSphere and start practicing.</p>
        </div>
        <form className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="reg-firstname" className="text-xs font-medium text-gray-700 uppercase tracking-wide">First Name</label>
            <input
              id="reg-firstname"
              type="text"
              placeholder="enter your first name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
              disabled={loading}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="reg-lastname" className="text-xs font-medium text-gray-700 uppercase tracking-wide">Last Name</label>
            <input
              id="reg-lastname"
              type="text"
              placeholder="enter your last name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
              disabled={loading}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="reg-username" className="text-xs font-medium text-gray-700 uppercase tracking-wide">Username</label>
            <input
              id="reg-username"
              type="text"
              placeholder="enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
              disabled={loading}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="reg-password" className="text-xs font-medium text-gray-700 uppercase tracking-wide">Password</label>
            <input
              id="reg-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
              disabled={loading}
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 font-medium bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full px-5 py-3 rounded-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-600 text-center">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-semibold text-purple-600 hover:text-purple-700 transition"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  )
}
