# API Structure Documentation

## Authentication Routes (`/pages/api/auth/`)

### POST /pages/api/auth/login
```typescript
Body: { email: string, password: string }
Response: { user: User, token: string } | { error: string }
```

### POST /pages/api/auth/signup
```typescript
Body: { email: string, password: string, name: string, department: string, studentId?: string }
Response: { user: User, token: string } | { error: string }
```

### POST /pages/api/auth/logout
```typescript
Response: { success: boolean }
```

### GET /pages/api/auth/me
```typescript
Headers: { Authorization: "Bearer <token>" }
Response: { user: User } | { error: string }
```

## Course Routes (`/pages/api/courses/`)

### GET /pages/api/courses
```typescript
Query: { 
  department?: string, 
  level?: number, 
  semester?: 'first' | 'second' | 'both',
  search?: string,
  limit?: number,
  page?: number
}
Response: { 
  courses: Course[], 
  pagination: { total: number, page: number, limit: number }
}
```

### GET /pages/api/courses/[id]
```typescript
Response: { course: Course } | { error: string }
```

### POST /pages/api/courses/bookmark
```typescript
Headers: { Authorization: "Bearer <token>" }
Body: { courseId: string }
Response: { success: boolean } | { error: string }
```

### DELETE /pages/api/courses/bookmark/[courseId]
```typescript
Headers: { Authorization: "Bearer <token>" }
Response: { success: boolean } | { error: string }
```

### GET /pages/api/courses/bookmarks
```typescript
Headers: { Authorization: "Bearer <token>" }
Response: { courses: Course[] }
```

## Chat Routes (`/pages/api/chat/`)

### POST /pages/api/chat/send
```typescript
Headers: { Authorization: "Bearer <token>" }
Body: { 
  courseId: string, 
  message: string, 
  sessionId?: string,
  context?: { topic?: string, courseWeek?: number }
}
Response: { 
  response: string, 
  sessionId: string,
  context: object
} | { error: string }
```

### GET /pages/api/chat/history
```typescript
Headers: { Authorization: "Bearer <token>" }
Query: { courseId?: string, sessionId?: string, limit?: number }
Response: { 
  chats: ChatHistory[],
  pagination: { total: number, page: number, limit: number }
}
```

### DELETE /pages/api/chat/session/[sessionId]
```typescript
Headers: { Authorization: "Bearer <token>" }
Response: { success: boolean } | { error: string }
```

## Exam Routes (`/pages/api/exam/`)

### POST /pages/api/exam/generate
```typescript
Headers: { Authorization: "Bearer <token>" }
Body: { 
  courseId: string, 
  difficulty: 'easy' | 'medium' | 'hard',
  questionCount: number,
  type: 'practice' | 'mock',
  topics?: string[]
}
Response: { 
  examSession: ExamAttempt,
  questions: Question[]
} | { error: string }
```

### POST /pages/api/exam/submit
```typescript
Headers: { Authorization: "Bearer <token>" }
Body: { 
  examId: string,
  answers: { questionId: string, answer: string }[]
}
Response: { 
  score: number,
  totalScore: number,
  feedback: QuestionFeedback[],
  examSession: ExamAttempt
} | { error: string }
```

### GET /pages/api/exam/attempts
```typescript
Headers: { Authorization: "Bearer <token>" }
Query: { courseId?: string, status?: string, limit?: number }
Response: { 
  attempts: ExamAttempt[],
  stats: { totalAttempts: number, averageScore: number }
}
```

### GET /pages/api/exam/[id]
```typescript
Headers: { Authorization: "Bearer <token>" }
Response: { attempt: ExamAttempt } | { error: string }
```

## User Routes (`/pages/api/user/`)

### GET /pages/api/user/profile
```typescript
Headers: { Authorization: "Bearer <token>" }
Response: { user: User } | { error: string }
```

### PUT /pages/api/user/profile
```typescript
Headers: { Authorization: "Bearer <token>" }
Body: { 
  name?: string, 
  department?: string, 
  preferences?: UserPreferences 
}
Response: { user: User } | { error: string }
```

### GET /pages/api/user/stats
```typescript
Headers: { Authorization: "Bearer <token>" }
Response: { 
  totalBookmarks: number,
  chatSessions: number,
  examAttempts: number,
  averageScore: number,
  recentActivity: Activity[]
}
```

## Response Format Standards

### Success Response
```typescript
{
  success: true,
  data: any,
  message?: string
}
```

### Error Response
```typescript
{
  success: false,
  error: string,
  code?: number
}
```

### Pagination
```typescript
{
  total: number,
  page: number,
  limit: number,
  hasNext: boolean,
  hasPrev: boolean
}
```