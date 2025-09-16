export interface Question {
  id: string
  type: 'multiple-choice' | 'short-answer' | 'essay'
  question: string
  options?: string[]
  correctAnswer: string
  userAnswer?: string
  isCorrect?: boolean
  points: number
}

export interface Exam {
  id: string
  userId: string
  courseId: string
  title: string
  questions: Question[]
  totalQuestions: number
  score?: number
  maxScore: number
  status: 'in-progress' | 'completed' | 'graded'
  timeLimit: number
  timeUsed?: number
  startedAt: Date
  submittedAt?: Date
  createdAt: Date
}

export interface ExamCreate {
  courseId: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  questionCount: number
  timeLimit: number
  topics?: string[]
}

export interface ExamSubmission {
  examId: string
  answers: Record<string, string>
}

export interface ExamResult {
  score: number
  maxScore: number
  percentage: number
  feedback: string[]
  correctAnswers: number
  totalQuestions: number
}