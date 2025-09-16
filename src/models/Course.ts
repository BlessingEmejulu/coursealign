import mongoose from 'mongoose'

export interface ICourse {
  _id: string
  code: string
  title: string
  description: string
  department: string
  level: number
  semester: 'first' | 'second' | 'both'
  credits: number
  prerequisites: string[]
  objectives: string[]
  outline: {
    week: number
    topic: string
    content: string
  }[]
  assessment: {
    type: string
    weight: number
    description: string
  }[]
  instructor: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const courseSchema = new mongoose.Schema<ICourse>({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
    enum: [100, 200, 300, 400, 500],
  },
  semester: {
    type: String,
    required: true,
    enum: ['first', 'second', 'both'],
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 6,
  },
  prerequisites: [String],
  objectives: [String],
  outline: [{
    week: {
      type: Number,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  }],
  assessment: [{
    type: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    description: String,
  }],
  instructor: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

export const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', courseSchema)