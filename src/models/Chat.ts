import mongoose from 'mongoose'

export interface IChat {
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

const chatSchema = new mongoose.Schema<IChat>({
  userId: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
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

export const Chat = mongoose.models.Chat || mongoose.model<IChat>('Chat', chatSchema)