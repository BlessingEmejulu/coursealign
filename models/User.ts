import mongoose from 'mongoose'

export interface IUser {
  _id: string
  email: string
  password: string
  name: string
  department: string
  studentId?: string
  avatar?: string
  preferences: {
    theme: 'light' | 'dark'
    notifications: boolean
  }
  bookmarkedCourses: string[]
  createdAt: Date
  updatedAt: Date
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    unique: true,
    sparse: true,
  },
  avatar: String,
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
    notifications: {
      type: Boolean,
      default: true,
    },
  },
  bookmarkedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
}, {
  timestamps: true,
})

// Create indexes
userSchema.index({ email: 1 })
userSchema.index({ studentId: 1 })

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema)