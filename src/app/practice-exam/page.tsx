import Link from 'next/link'
import { Menu, Clock, Sparkles, BookOpen } from 'lucide-react'

export default function PracticeExamPage() {
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
            <h1 className="text-xl font-semibold text-gray-900">Practice Exam</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-sm mx-auto lg:max-w-4xl px-4 py-6 lg:ml-64" role="main">
        <div className="text-center py-12 lg:py-20">
          {/* Coming Soon Icon */}
          <div className="relative mx-auto mb-8">
            <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <Clock className="w-12 h-12 lg:w-16 lg:h-16 text-blue-600" aria-hidden="true" />
            </div>
            {/* Sparkle accent */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-yellow-600" aria-hidden="true" />
            </div>
          </div>

          {/* Coming Soon Text */}
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Coming Soon!
          </h2>
          
          <p className="text-lg lg:text-xl text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
            AI-powered practice exams and mock tests are being crafted for your success.
          </p>

          {/* Feature Preview */}
          <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 mb-8 text-left max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 text-blue-600 mr-2" aria-hidden="true" />
              What's Coming
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                AI-generated practice questions
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Instant feedback and explanations
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Progress tracking and analytics
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Timed mock examinations
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/course-outline"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Browse Courses
            </Link>
            <Link 
              href="/chat"
              className="bg-white hover:bg-gray-50 text-blue-600 font-medium py-3 px-6 rounded-xl border-2 border-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Chat with AI Instead
            </Link>
          </div>

          {/* Back to Home */}
          <div className="mt-8">
            <Link 
              href="/"
              className="text-gray-500 hover:text-blue-600 font-medium transition-colors focus:outline-none focus:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Additional Desktop Content */}
        <div className="hidden lg:block mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Stay Updated
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Be the first to know when practice exams become available. We're working hard to bring you the best AI-powered learning experience.
              </p>
              <div className="flex justify-center space-x-4 text-sm text-blue-600">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                  In Development
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Course Outline Ready
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  AI Chat Available
                </span>
              </div>
            </div>
          </div>
        </div>
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
            <Link href="/bookmarks" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="w-3 h-3 bg-gray-600 rounded"></span>
              </div>
              <span>Bookmarks</span>
            </Link>
            <Link href="/practice-exam" className="flex items-center space-x-3 p-3 bg-blue-50 text-blue-700 rounded-xl">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-medium">Practice Exam</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}