import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Send message to AI and get response
  return NextResponse.json({ message: 'AI chat response' })
}

export async function GET(request: NextRequest) {
  // Get chat history
  return NextResponse.json({ message: 'Get chat history' })
}