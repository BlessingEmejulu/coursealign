'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { SAMPLE_COURSES, COURSE_LEVELS, COURSE_SEMESTERS, type Course } from '@/constants/courseData'
import CourseCard from '@/components/ui/CourseCard'

export default function CourseOutlinePage() {
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedSemester, setSelectedSemester] = useState('all')
  const [courses, setCourses] = useState<Course[]>(SAMPLE_COURSES)

  // Filter courses based on selected level and semester
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const levelMatch = selectedLevel === 'all' || course.level === selectedLevel
      const semesterMatch = selectedSemester === 'all' || course.semester === selectedSemester
      return levelMatch && semesterMatch
    })
  }, [courses, selectedLevel, selectedSemester])

  const handleBookmarkToggle = (courseId: string) => {
    setCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === courseId 
          ? { ...course, isBookmarked: !course.isBookmarked }
          : course
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10" role="banner">
        <div className="max-w-sm mx-auto lg:max-w-4xl px-4 py-4">
          <div className="flex items-center space-x-4">
            {/* Back Button */}
            <Link 
              href="/"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Go back to homepage"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" aria-hidden="true" />
            </Link>
            
            {/* Page Title */}
            <h1 className="text-xl font-semibold text-gray-900">Selected Courses</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-sm mx-auto lg:max-w-4xl px-4 py-6 lg:ml-64" role="main">
        {/* Filter Section */}
        <section className="mb-6" aria-labelledby="filter-heading">
          <h2 id="filter-heading" className="sr-only">Filter courses</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Level Filter */}
            <div className="relative">
              <label htmlFor="level-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Level
              </label>
              <div className="relative">
                <select
                  id="level-filter"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  aria-describedby="level-filter-description"
                >
                  {COURSE_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" aria-hidden="true" />
              </div>
              <div id="level-filter-description" className="sr-only">
                Filter courses by academic level (100, 200, 300, or 400 level)
              </div>
            </div>

            {/* Semester Filter */}
            <div className="relative">
              <label htmlFor="semester-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Semester
              </label>
              <div className="relative">
                <select
                  id="semester-filter"
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  aria-describedby="semester-filter-description"
                >
                  {COURSE_SEMESTERS.map((semester) => (
                    <option key={semester.value} value={semester.value}>
                      {semester.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" aria-hidden="true" />
              </div>
              <div id="semester-filter-description" className="sr-only">
                Filter courses by semester (1st or 2nd semester)
              </div>
            </div>
          </div>

          {/* Filter Results Summary */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
            {selectedLevel !== 'all' && ` for ${COURSE_LEVELS.find(l => l.value === selectedLevel)?.label}`}
            {selectedSemester !== 'all' && ` in ${COURSE_SEMESTERS.find(s => s.value === selectedSemester)?.label}`}
          </div>
        </section>

        {/* Courses Grid */}
        <section aria-labelledby="courses-heading">
          <h2 id="courses-heading" className="sr-only">Available courses</h2>
          
          {filteredCourses.length > 0 ? (
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <ArrowLeft className="w-8 h-8 text-gray-400" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-500 mb-4">
                No courses match your current filter criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedLevel('all')
                  setSelectedSemester('all')
                }}
                className="text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Desktop Sidebar Navigation (hidden on mobile) */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">CA</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">CourseAlign</h1>
          </div>
          
          <nav className="space-y-2" role="navigation" aria-label="Main navigation">
            <Link href="/" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="w-3 h-3 bg-gray-600 rounded"></span>
              </div>
              <span>Home</span>
            </Link>
            <Link href="/course-outline" className="flex items-center space-x-3 p-3 bg-blue-50 text-blue-700 rounded-xl">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="w-3 h-3 bg-blue-600 rounded"></span>
              </div>
              <span className="font-medium">Course Outline</span>
            </Link>
            <Link href="/chat" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-gray-600">AI</span>
              </div>
              <span>Chat With AI</span>
            </Link>
            <Link href="/bookmarks" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="w-3 h-3 bg-gray-600 rounded"></span>
              </div>
              <span>Bookmarks</span>
            </Link>
            <Link href="/practice-exam" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="w-3 h-3 bg-gray-600 rounded"></span>
              </div>
              <span>Practice Exam</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}