import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Get all courses with filters
  return NextResponse.json({ message: 'Get courses' })
}

export async function POST(request: NextRequest) {
  // Create new course
  return NextResponse.json({ message: 'Create course' })
}

export async function PUT(request: NextRequest) {
  // Update course
  return NextResponse.json({ message: 'Update course' })
}

export async function DELETE(request: NextRequest) {
  // Delete course
  return NextResponse.json({ message: 'Delete course' })
}