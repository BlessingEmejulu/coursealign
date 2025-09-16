export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface Chat {
  id: string
  userId: string
  courseId: string
  sessionId: string
  messages: ChatMessage[]
  context: ChatContext
  createdAt: Date
  updatedAt: Date
}

export interface ChatContext {
  topic?: string
  courseWeek?: number
  relatedOutline?: string
}

export interface ChatSend {
  courseId: string
  message: string
  sessionId?: string
  context?: ChatContext
}

export interface ChatResponse {
  response: string
  sessionId: string
  context: ChatContext
}

export interface ChatSession {
  sessionId: string
  courseId: string
  courseName: string
  lastMessage: string
  lastActivity: Date
  messageCount: number
}