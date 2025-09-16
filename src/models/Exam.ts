import mongoose from 'mongoose'

export interface IExam {
  _id: string
  userId: string
  courseId: string
  title: string
  questions: {
    id: string
    type: 'multiple-choice' | 'short-answer' | 'essay'
    question: string
    options?: string[]
    correctAnswer: string
    userAnswer?: string
    isCorrect?: boolean
    points: number
  }[]
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

const examSchema = new mongoose.Schema<IExam>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  questions: [{
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['multiple-choice', 'short-answer', 'essay'],
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: [String],
    correctAnswer: {
      type: String,
      required: true,
    },
    userAnswer: String,
    isCorrect: Boolean,
    points: {
      type: Number,
      required: true,
      min: 0,
    },
  }],
  totalQuestions: {
    type: Number,
    required: true,
  },
  score: Number,
  maxScore: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'graded'],
    default: 'in-progress',
  },
  timeLimit: {
    type: Number,
    required: true,
  },
  timeUsed: Number,
  startedAt: {
    type: Date,
    default: Date.now,
  },
  submittedAt: Date,
}, {
  timestamps: true,
})

export const Exam = mongoose.models.Exam || mongoose.model<IExam>('Exam', examSchema)