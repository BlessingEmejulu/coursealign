import mongoose from 'mongoose'

export interface IExamAttempt {
  _id: string
  userId: string
  courseId: string
  sessionType: 'practice' | 'mock' | 'review'
  questions: {
    id: string
    question: string
    type: 'multiple_choice' | 'short_answer' | 'essay'
    options?: string[]
    correctAnswer: string
    userAnswer?: string
    isCorrect?: boolean
    feedback: string
    points: number
    timeSpent: number
  }[]
  totalQuestions: number
  correctAnswers: number
  totalScore: number
  maxScore: number
  timeLimit: number
  timeUsed: number
  status: 'in_progress' | 'completed' | 'abandoned'
  aiGeneratedQuestions: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  createdAt: Date
  completedAt?: Date
}

const examAttemptSchema = new mongoose.Schema<IExamAttempt>({
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
  sessionType: {
    type: String,
    enum: ['practice', 'mock', 'review'],
    required: true,
  },
  questions: [{
    id: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['multiple_choice', 'short_answer', 'essay'],
      required: true,
    },
    options: [String],
    correctAnswer: {
      type: String,
      required: true,
    },
    userAnswer: String,
    isCorrect: Boolean,
    feedback: String,
    points: {
      type: Number,
      required: true,
      min: 0,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
  }],
  totalQuestions: {
    type: Number,
    required: true,
  },
  correctAnswers: {
    type: Number,
    default: 0,
  },
  totalScore: {
    type: Number,
    default: 0,
  },
  maxScore: {
    type: Number,
    required: true,
  },
  timeLimit: {
    type: Number,
    required: true,
  },
  timeUsed: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress',
  },
  aiGeneratedQuestions: {
    type: Boolean,
    default: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  completedAt: Date,
}, {
  timestamps: true,
})

// Create indexes
examAttemptSchema.index({ userId: 1, courseId: 1 })
examAttemptSchema.index({ userId: 1, createdAt: -1 })
examAttemptSchema.index({ status: 1 })

export const ExamAttempt = mongoose.models.ExamAttempt || mongoose.model<IExamAttempt>('ExamAttempt', examAttemptSchema)