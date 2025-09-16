// Exam generation and grading utilities

export interface Question {
  id: string
  type: 'multiple-choice' | 'short-answer' | 'essay'
  question: string
  options?: string[]
  correctAnswer: string
  points: number
}

export interface ExamSession {
  id: string
  courseId: string
  userId: string
  questions: Question[]
  answers: Record<string, string>
  score?: number
  submittedAt?: Date
}

export function calculateScore(questions: Question[], answers: Record<string, string>): number {
  let totalPoints = 0
  let earnedPoints = 0

  questions.forEach(question => {
    totalPoints += question.points
    if (answers[question.id] === question.correctAnswer) {
      earnedPoints += question.points
    }
  })

  return totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0
}

export function generateFeedback(questions: Question[], answers: Record<string, string>): string[] {
  return questions.map(question => {
    const userAnswer = answers[question.id]
    const isCorrect = userAnswer === question.correctAnswer
    
    if (isCorrect) {
      return `✓ Correct answer for: ${question.question}`
    } else {
      return `✗ Incorrect. The correct answer was: ${question.correctAnswer}`
    }
  })
}