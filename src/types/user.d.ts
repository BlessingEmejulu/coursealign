export interface User {
  id: string
  email: string
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

export interface UserCreate {
  email: string
  password: string
  name: string
  department: string
  studentId?: string
}

export interface UserLogin {
  email: string
  password: string
}

export interface UserSession {
  id: string
  email: string
  name: string
  department: string
}