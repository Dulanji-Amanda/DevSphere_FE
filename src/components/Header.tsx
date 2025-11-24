import { Link, useNavigate } from "react-router-dom"
import { useCallback, useMemo } from "react"
import { useAuth } from "../context/authContext"

export default function Header() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    navigate("/login")
  }, [navigate, setUser])

  const canViewMyPosts = useMemo(
    () => !!user?.roles?.some((r: string) => r === "ADMIN" || r === "AUTHOR"),
    [user?.roles]
  )

  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center" role="banner">
      <nav className="flex space-x-4" aria-label="Main navigation">
        <Link to="/home" className="hover:underline">
          Home
        </Link>
        <Link to="/post" className="hover:underline">
          Posts
        </Link>
        {canViewMyPosts && (
          <Link to="/my-post" className="hover:underline">
            My Posts
          </Link>
        )}
      </nav>
      <div className="flex items-center space-x-4">
        <span>{user?.email || "Guest"}</span>
        {user && (
          <button
            onClick={handleLogout}
            className="bg-white text-blue-500 px-2 py-1 rounded"
            type="button"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  )
}
