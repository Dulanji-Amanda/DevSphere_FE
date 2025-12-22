import { lazy, Suspense, type ReactNode } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "../context/authContext"
import Layout from "../components/Layout"

const Index = lazy(() => import("../pages"))
const Login = lazy(() => import("../pages/Login"))
const Register = lazy(() => import("../pages/Register"))
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"))
const ResetPassword = lazy(() => import("../pages/ResetPassword"))
const Profile = lazy(() => import("../pages/Profile"))
const Home = lazy(() => import("../pages/Home"))
const Post = lazy(() => import("../pages/Post"))
const MyPost = lazy(() => import("../pages/MyPost"))
const FirstPage = lazy(() => import("../pages/firstpage"))
const QuizJava = lazy(() => import("../pages/java"))
const QuizPython = lazy(() => import("../pages/python"))
const QuizTS = lazy(() => import("../pages/typescript"))
const QuizJS = lazy(() => import("../pages/javascript"))
const QuizHTML = lazy(() => import("../pages/html"))
const QuizCSS = lazy(() => import("../pages/css"))
const QuizCSharp = lazy(() => import("../pages/csharp"))
const QuizGo = lazy(() => import("../pages/go"))

type RequireAuthTypes = { children: ReactNode; roles?: string[] }

const RequireAuth = ({ children, roles }: RequireAuthTypes) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.some((role) => user.roles?.includes(role))) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    )
  }

  return <>{children}</>
}

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/firstpage" element={<FirstPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quiz/java" element={<QuizJava />} />
          <Route path="/quiz/python" element={<QuizPython />} />
          <Route path="/quiz/typescript" element={<QuizTS />} />
          <Route path="/quiz/javascript" element={<QuizJS />} />
          <Route path="/quiz/html" element={<QuizHTML />} />
          <Route path="/quiz/css" element={<QuizCSS />} />
          <Route path="/quiz/csharp" element={<QuizCSharp />} />
          <Route path="/quiz/go" element={<QuizGo />} />
          <Route
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/post" element={<Post />} />
            <Route
              path="/my-post"
              element={
                <RequireAuth roles={["ADMIN", "AUTHOR"]}>
                  <MyPost />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
