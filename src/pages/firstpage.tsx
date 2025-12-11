import { ArrowRight,Code2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from "../services/auth";
import { useAuth } from "../context/authContext";

export default function DevSphereLanding() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const languages = [
    { name: 'JavaScript', icon: '💻', description: 'Test your knowledge with 20 AI-generated questions on JavaScript.' },
    { name: 'Python', icon: '🐍', description: 'Test your knowledge with 20 AI-generated questions on Python.' },
    { name: 'Java', icon: '☕', description: 'Test your knowledge with 20 AI-generated questions on Java.' },
    { name: 'HTML', icon: '</>', description: 'Test your knowledge with 20 AI-generated questions on HTML.' },
    { name: 'CSS', icon: '🎨', description: 'Test your knowledge with 20 AI-generated questions on CSS.' },
    { name: 'TypeScript', icon: '⚡', description: 'Test your knowledge with 20 AI-generated questions on TypeScript.' },
    { name: 'C#', icon: '✱', description: 'Test your knowledge with 20 AI-generated questions on C#.' },
    { name: 'Go', icon: '🔷', description: 'Test your knowledge with 20 AI-generated questions on Go.' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gray-800 text-white py-12 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">DevSphere</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                logout()
                setUser(null)
                navigate("/login")
              }}
              className="px-6 py-2 rounded-lg font-medium text-white border border-purple-200 hover:bg-purple-700 hover:text-white hover:border-purple-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold text-purple-600 mb-6">
            Welcome to DevSphere
          </h2>
          <p className="text-xl text-gray-600">
            Your AI-powered partner for mastering programming languages. Select a language below to start your journey.
          </p>
        </div>

        {/* Choose Your Challenge */}
        <div className="mb-12">
          <h3 className="text-4xl font-bold text-center mb-12">
            Choose Your Challenge
          </h3>

          {/* All Language Cards in Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {languages.map((lang) => (
              <div key={lang.name} className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                    {lang.icon}
                  </div>
                  <h4 className="text-2xl font-bold">{lang.name}</h4>
                </div>
                <p className="text-gray-600 mb-6">
                  {lang.description}
                </p>
                <button
                  onClick={() => {
                    const name = lang.name.toLowerCase()
                    const pathMap: Record<string, string> = {
                      javascript: "/quiz/javascript",
                      typescript: "/quiz/typescript",
                      python: "/quiz/python",
                      java: "/quiz/java",
                      html: "/quiz/html",
                      css: "/quiz/css",
                      "c#": "/quiz/csharp",
                      go: "/quiz/go"
                    }
                    const target = pathMap[name]
                    if (target) {
                      navigate(target)
                    } else {
                      navigate("/quiz/java")
                    }
                  }}
                  className="group flex items-center gap-2 px-4 py-2 text-purple-600 font-semibold border border-purple-300 rounded-md hover:bg-purple-50 hover:border-purple-400 hover:gap-3 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
                >
                  Start Quiz
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

     {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Code2 className="w-6 h-6" />
            <span className="text-xl font-bold">DevSphere</span>
          </div>
          <p className="text-gray-400">Master programming languages with AI-powered quizzes</p>
          <p className="text-gray-500 mt-4 text-sm">© 2025 DevSphere. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}