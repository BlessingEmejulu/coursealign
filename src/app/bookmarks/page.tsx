'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Menu, Bookmark, BookmarkX } from 'lucide-react'
import { SAMPLE_COURSES, type Course } from '@/constants/courseData'
import CourseCard from '@/components/ui/CourseCard'

export default function BookmarksPage() {
  const [courses, setCourses] = useState<Course[]>(SAMPLE_COURSES)

  // Filter to show only bookmarked courses
  const bookmarkedCourses = useMemo(() => {
    return courses.filter(course => course.isBookmarked)
  }, [courses])

  const handleBookmarkToggle = (courseId: string) => {
    setCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === courseId 
          ? { ...course, isBookmarked: !course.isBookmarked }
          : course
      )
    )
  }

  const clearAllBookmarks = () => {
    setCourses(prevCourses => 
      prevCourses.map(course => ({ ...course, isBookmarked: false }))
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10" role="banner">
        <div className="max-w-sm mx-auto lg:max-w-4xl px-4 py-4">
          <div className="flex items-center space-x-4">
            {/* Hamburger Menu */}
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Open navigation menu"
              type="button"
            >
              <Menu className="w-6 h-6 text-gray-700" aria-hidden="true" />
            </button>
            
            {/* Page Title */}
            <h1 className="text-xl font-semibold text-gray-900">My Bookmarks</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-sm mx-auto lg:max-w-4xl px-4 py-6 lg:ml-64" role="main">
        {/* Header Section */}
        <section className="mb-6" aria-labelledby="bookmarks-summary">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 id="bookmarks-summary" className="text-lg font-semibold text-gray-900">
                Saved Courses
              </h2>
              <p className="text-sm text-gray-600">
                {bookmarkedCourses.length} course{bookmarkedCourses.length !== 1 ? 's' : ''} bookmarked
              </p>
            </div>
            
            {bookmarkedCourses.length > 0 && (
              <button
                onClick={clearAllBookmarks}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium text-sm transition-colors focus:outline-none focus:underline"
                aria-label="Remove all bookmarks"
              >
                <BookmarkX className="w-4 h-4" aria-hidden="true" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </section>

        {/* Bookmarked Courses */}
        <section aria-labelledby="bookmarked-courses-heading">
          <h2 id="bookmarked-courses-heading" className="sr-only">Your bookmarked courses</h2>
          
          {bookmarkedCourses.length > 0 ? (
            <div className="space-y-4">
              {bookmarkedCourses.map((course) => (
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
                <Bookmark className="w-8 h-8 text-gray-400" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks yet</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Start bookmarking courses to access them quickly from here.
              </p>
              <Link
                href="/course-outline"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Browse Courses
              </Link>
            </div>
          )}
        </section>

        {/* Additional Desktop Content */}
        <div className="hidden lg:block mt-12">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link 
                href="/course-outline"
                className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bookmark className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Find More Courses</p>
                  <p className="text-sm text-gray-500">Browse course catalog</p>
                </div>
              </Link>
              
              <Link 
                href="/chat"
                className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">AI</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Ask AI</p>
                  <p className="text-sm text-gray-500">Get course help</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Desktop Sidebar Navigation (hidden on mobile) */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
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
            <Link href="/course-outline" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="w-3 h-3 bg-gray-600 rounded"></span>
              </div>
              <span>Course Outline</span>
            </Link>
            <Link href="/chat" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-gray-600">AI</span>
              </div>
              <span>Chat With AI</span>
            </Link>
            <Link href="/bookmarks" className="flex items-center space-x-3 p-3 bg-orange-50 text-orange-700 rounded-xl">
              <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                <Bookmark className="w-4 h-4 text-orange-600" />
              </div>
              <span className="font-medium">Bookmarks</span>
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