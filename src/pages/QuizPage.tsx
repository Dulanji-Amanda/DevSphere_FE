import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowRight, ArrowLeft, CheckCircle, XCircle, Trophy } from "lucide-react"
import { fetchQuiz, scoreQuiz, type QuizQuestion } from "../services/quiz"
import BackButton from "../components/BackButton"
import { useNavigate } from "react-router-dom"

type Props = { language: string; emoji?: string; title?: string }

export default function QuizPage({ language, emoji = "🎓", title }: Props) {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [quizComplete, setQuizComplete] = useState(false)
  const [loading, setLoading] = useState(true)
  const fetchSeq = useRef(0)

  const pageTitle = useMemo(() => title ?? `${language.toUpperCase()} QUESTION`, [language, title])

  useEffect(() => {
    const currentFetch = ++fetchSeq.current
    let mounted = true
    const loadQuestions = async () => {
      setLoading(true)
      try {
        const qs = await fetchQuiz(language)
        if (!mounted || currentFetch !== fetchSeq.current) return
        setQuestions(qs)
      } catch (err) {
        console.error("Failed to load quiz questions", err)
        alert("Failed to load quiz questions. Please check backend is running and API URL.")
      } finally {
        if (mounted && currentFetch === fetchSeq.current) setLoading(false)
      }
    }

    loadQuestions()

    return () => {
      mounted = false
    }
  }, [language])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-purple-500 border-dashed rounded-full animate-spin"></div>
      </div>
    )
  }

  const handleAnswerClick = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
  }

  const handleSubmit = () => {
    if (selectedAnswer === null) return
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer
    if (isCorrect) setScore((s) => s + 1)
    const nextAnswers = [...answers]
    nextAnswers[currentQuestion] = selectedAnswer
    setAnswers(nextAnswers)
    setShowResult(true)
  }

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      try {
        await scoreQuiz(questions, answers)
      } catch (e) {}
      setQuizComplete(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((q) => q - 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnswers([])
    setQuizComplete(false)
  }

  if (quizComplete) {
    const percentage = questions.length ? (score / questions.length) * 100 : 0
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="bg-slate-700 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold text-white">DevSphere</h1>
          </div>
        </header>
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Quiz Complete!</h2>
            <p className="text-xl text-gray-600 mb-8">Congratulations on completing the {language} quiz</p>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 mb-8">
              <div className="text-6xl font-bold text-purple-600 mb-2">{score}/{questions.length}</div>
              <p className="text-xl text-gray-700">You scored {percentage.toFixed(0)}%</p>
            </div>
            <div className="flex gap-4 justify-center">
              <button onClick={restartQuiz} className="bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-lg">Retake Quiz</button>
              <button onClick={() => navigate("/firstpage")} className="bg-slate-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all">Back to Home</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Guard: if we somehow have no questions, show a helpful message instead of crashing
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No quiz questions available</h2>
            <p className="text-gray-600 mb-6">We couldn't find any questions for the {language} quiz.</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => window.location.reload()} className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700">Retry</button>
              <button onClick={() => navigate("/firstpage")} className="bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800">Back to Home</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const isCorrect = showResult && selectedAnswer === currentQ.correctAnswer

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">DevSphere</h1>
          <div className="flex items-center gap-6">
            <div className="text-white">
              <span className="text-sm opacity-80">Question</span>
              <span className="ml-2 font-bold">{currentQuestion + 1}/{questions.length}</span>
            </div>
            <div className="text-white">
              <span className="text-sm opacity-80">Score</span>
              <span className="ml-2 font-bold">{score}/{questions.length}</span>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Progress</span>
            <span className="text-sm font-semibold text-purple-600">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-700 h-full rounded-full transition-all duration-500" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {emoji}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-purple-600 mb-2">{pageTitle} {currentQuestion + 1}</h3>
              <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">{currentQ.question}</h2>
            </div>
          </div>
          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrectAnswer = index === currentQ.correctAnswer
              const showCorrect = showResult && isCorrectAnswer
              const showWrong = showResult && isSelected && !isCorrect
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={showResult}
                  className={`w-full p-5 rounded-xl text-left font-medium transition-all border-2 ${
                    showCorrect
                      ? "bg-green-50 border-green-500 text-green-900"
                      : showWrong
                      ? "bg-red-50 border-red-500 text-red-900"
                      : isSelected
                      ? "bg-purple-50 border-purple-500 text-purple-900"
                      : "bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50"
                  } ${showResult ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showCorrect && <CheckCircle className="w-6 h-6 text-green-600" />}
                    {showWrong && <XCircle className="w-6 h-6 text-red-600" />}
                  </div>
                </button>
              )
            })}
          </div>
          {showResult && (
            <div className={`mt-6 p-6 rounded-xl ${isCorrect ? "bg-green-50 border-2 border-green-200" : "bg-red-50 border-2 border-red-200"}`}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                )}
                <div>
                  <h4 className={`font-bold text-lg mb-2 ${isCorrect ? "text-green-900" : "text-red-900"}`}>{isCorrect ? "Correct!" : "Incorrect"}</h4>
                  <p className="text-gray-700 leading-relaxed">{currentQ.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <button onClick={handlePrevious} disabled={currentQuestion === 0} className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>
          {!showResult ? (
            <button onClick={handleSubmit} disabled={selectedAnswer === null} className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg">
              Submit Answer
            </button>
          ) : (
            <button onClick={handleNext} className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-lg">
              {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      <BackButton />
    </div>
  )
}
