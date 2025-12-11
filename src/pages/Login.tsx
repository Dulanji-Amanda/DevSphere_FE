import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"
import { login, getMyDetails, type LoginResponse, type UserDetailsResponse } from "../services/auth"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault() // prevent page refresh

    if (!username.trim() || !password.trim()) {
      alert("Please enter both username and password.")
      return
    }

    try {
      const data: LoginResponse = await login(username, password)

      if (data?.data?.accessToken) {
        localStorage.setItem("accessToken", data.data.accessToken)
        localStorage.setItem("refreshToken", data.data.refreshToken)

        const resData: UserDetailsResponse = await getMyDetails()
        setUser(resData.data)
        navigate("/firstpage")
      } else {
        alert("Login failed, please check your credentials.")
      }
    } catch (err) {
      console.error("Login error:", err)
      alert("Login failed, please check your credentials.")
    }

    // ----- Example of axios call (besic) -----
    /*
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        { email: username, password },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
    */
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-md p-8">
        <h1 className="text-3xl font-bold mb-1 text-purple-600 text-center">Sign In</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">Access your DevSphere account.</p>
        <form className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="login-username" className="text-xs font-medium text-gray-700 uppercase tracking-wide">Email</label>
            <input
              id="login-username"
              type="email"
              placeholder="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="login-password" className="text-xs font-medium text-gray-700 uppercase tracking-wide">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
            />
            <div className="text-right">
              <button
                type="button"
                className="text-xs font-medium text-purple-600 hover:text-purple-700"
                onClick={() => {
                  // Placeholder: wire this to your reset route when available
                  alert("Forgot password flow coming soon.")
                }}
              >
                Forgot password?
              </button>
            </div>
          </div>
          <button
            onClick={handleLogin}
            className="w-full px-5 py-3 rounded-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-600 text-center">
          Don't have an account?{' '}
          <button
            className="font-semibold text-purple-600 hover:text-purple-700 transition"
            onClick={() => navigate('/register')}
            type="button"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  )
}
