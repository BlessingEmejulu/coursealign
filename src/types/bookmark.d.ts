export interface Bookmark {
  id: string
  userId: string
  courseId: string
  type: 'course' | 'topic' | 'resource'
  reference?: string
  notes?: string
  tags: string[]
  createdAt: Date
}

export interface BookmarkCreate {
  courseId: string
  type: 'course' | 'topic' | 'resource'
  reference?: string
  notes?: string
  tags?: string[]
}

export interface BookmarkUpdate {
  notes?: string
  tags?: string[]
}