import React from "react"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function BackButton() {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate("/firstpage")}
      className="fixed bottom-6 right-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      aria-label="Back to first page"
      title="Back"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm font-semibold">Back</span>
    </button>
  )
}