import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Course } from '@/models/Course'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const level = searchParams.get('level')
    const semester = searchParams.get('semester')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Build query
    const query: any = { isActive: true }
    
    if (department) {
      query.department = department
    }
    
    if (level) {
      query.level = parseInt(level)
    }
    
    if (semester && semester !== 'both') {
      query.semester = { $in: [semester, 'both'] }
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    // Execute query with pagination
    const skip = (page - 1) * limit
    const [courses, total] = await Promise.all([
      Course.find(query)
        .sort({ level: 1, code: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Course.countDocuments(query),
    ])

    return NextResponse.json({
      success: true,
      data: {
        courses,
        pagination: {
          total,
          page,
          limit,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    })
  } catch (error) {
    console.error('Courses fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}