import api from "./api"

export type QuizQuestion = {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export const fetchQuiz = async (language: string): Promise<QuizQuestion[]> => {
  const res = await api.post("/ai/generate", { language })
  return res.data.questions as QuizQuestion[]
}

export const scoreQuiz = async (questions: QuizQuestion[], answers: number[]) => {
  const res = await api.post("/ai/score", { questions, answers })
  return res.data as { total: number; correct: number; percentage: number }
}
