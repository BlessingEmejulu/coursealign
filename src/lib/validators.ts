// Input validation using Zod

import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  department: z.string().min(1),
})

export const courseSchema = z.object({
  code: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  level: z.number().min(100).max(500),
  semester: z.enum(['first', 'second', 'both']),
  credits: z.number().min(1).max(6),
})

export const chatMessageSchema = z.object({
  message: z.string().min(1),
  courseId: z.string().min(1),
})

export const examAnswerSchema = z.object({
  questionId: z.string(),
  answer: z.string(),
})

export type UserInput = z.infer<typeof userSchema>
export type CourseInput = z.infer<typeof courseSchema>
export type ChatMessageInput = z.infer<typeof chatMessageSchema>
export type ExamAnswerInput = z.infer<typeof examAnswerSchema>