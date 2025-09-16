import mongoose from 'mongoose'

export interface IBookmark {
  _id: string
  userId: string
  courseId: string
  type: 'course' | 'topic' | 'resource'
  reference?: string
  notes?: string
  tags: string[]
  createdAt: Date
}

const bookmarkSchema = new mongoose.Schema<IBookmark>({
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
  type: {
    type: String,
    enum: ['course', 'topic', 'resource'],
    required: true,
  },
  reference: String,
  notes: String,
  tags: [String],
}, {
  timestamps: true,
})

export const Bookmark = mongoose.models.Bookmark || mongoose.model<IBookmark>('Bookmark', bookmarkSchema)