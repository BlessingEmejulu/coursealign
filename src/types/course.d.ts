export interface Course {
  id: string
  code: string
  title: string
  description: string
  department: string
  level: number
  semester: 'first' | 'second' | 'both'
  credits: number
  prerequisites: string[]
  objectives: string[]
  outline: CourseOutlineItem[]
  assessment: Assessment[]
  instructor: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CourseOutlineItem {
  week: number
  topic: string
  content: string
}

export interface Assessment {
  type: string
  weight: number
  description: string
}

export interface CourseCreate {
  code: string
  title: string
  description: string
  department: string
  level: number
  semester: 'first' | 'second' | 'both'
  credits: number
  prerequisites?: string[]
  objectives?: string[]
  outline?: CourseOutlineItem[]
  assessment?: Assessment[]
  instructor: string
}

export interface CourseFilter {
  department?: string
  level?: number
  semester?: 'first' | 'second' | 'both'
  search?: string
}