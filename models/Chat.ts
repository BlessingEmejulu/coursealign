import mongoose from 'mongoose'

export interface IChatHistory {
  _id: string
  userId: string
  courseId: string
  sessionId: string
  messages: {
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }[]
  context: {
    topic?: string
    courseWeek?: number
    relatedOutline?: string
  }
  createdAt: Date
  updatedAt: Date
}

const chatHistorySchema = new mongoose.Schema<IChatHistory>({
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
  sessionId: {
    type: String,
    required: true,
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  context: {
    topic: String,
    courseWeek: Number,
    relatedOutline: String,
  },
}, {
  timestamps: true,
})

// Create indexes
chatHistorySchema.index({ userId: 1, courseId: 1 })
chatHistorySchema.index({ sessionId: 1 })
chatHistorySchema.index({ createdAt: -1 })

export const ChatHistory = mongoose.models.ChatHistory || mongoose.model<IChatHistory>('ChatHistory', chatHistorySchema)