import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface CourseContext {
  courseCode: string
  courseTitle: string
  currentTopic?: string
  courseWeek?: number
  outline?: string
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  async chatWithTutor(
    messages: ChatMessage[],
    courseContext: CourseContext
  ): Promise<string> {
    try {
      const contextPrompt = this.buildContextPrompt(courseContext)
      const conversationHistory = this.formatMessages(messages)
      
      const prompt = `${contextPrompt}\n\n${conversationHistory}\n\nAssistant:`
      
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Gemini chat error:', error)
      throw new Error('Failed to get response from AI tutor')
    }
  }

  async generateExamQuestions(
    courseContext: CourseContext,
    difficulty: 'easy' | 'medium' | 'hard',
    questionCount: number = 10,
    topics?: string[]
  ): Promise<any[]> {
    try {
      const prompt = this.buildExamPrompt(courseContext, difficulty, questionCount, topics)
      
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const questionsText = response.text()
      
      // Parse the JSON response
      return JSON.parse(questionsText)
    } catch (error) {
      console.error('Question generation error:', error)
      throw new Error('Failed to generate exam questions')
    }
  }

  private buildContextPrompt(context: CourseContext): string {
    return `You are an AI tutor for the course ${context.courseCode}: ${context.courseTitle}.
    
${context.currentTopic ? `Current topic: ${context.currentTopic}` : ''}
${context.courseWeek ? `Current week: ${context.courseWeek}` : ''}
${context.outline ? `Course outline: ${context.outline}` : ''}

You should:
1. Provide clear, educational explanations
2. Use examples relevant to the course material
3. Encourage learning and understanding
4. Ask follow-up questions to check comprehension
5. Be patient and supportive

Keep responses concise but informative.`
  }

  private formatMessages(messages: ChatMessage[]): string {
    return messages
      .map(msg => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
      .join('\n')
  }

  private buildExamPrompt(
    context: CourseContext,
    difficulty: string,
    count: number,
    topics?: string[]
  ): string {
    const topicsText = topics?.length ? `Focus on these topics: ${topics.join(', ')}` : ''
    
    return `Generate ${count} ${difficulty} exam questions for ${context.courseCode}: ${context.courseTitle}.

${topicsText}

Return a JSON array of questions with this exact format:
[
  {
    "id": "unique_id",
    "question": "Question text",
    "type": "multiple_choice",
    "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
    "correctAnswer": "A) Option 1",
    "feedback": "Explanation of why this is correct",
    "points": 10
  }
]

Mix question types: 70% multiple choice, 20% short answer, 10% essay.
Ensure questions test understanding, not just memorization.
Provide detailed feedback for each question.`
  }
}

export const geminiService = new GeminiService()