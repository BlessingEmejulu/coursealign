'use client'

import Link from 'next/link'
import { Search, Menu, BookOpen, MessageCircle, Bookmark, Settings } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-sm mx-auto lg:max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Hamburger Menu */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            
            {/* Home Title */}
            <h1 className="text-xl font-semibold text-gray-900">Home</h1>
            
            {/* Profile Avatar */}
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-sm mx-auto lg:max-w-4xl px-4 py-6 space-y-6">
        {/* Greeting */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hi Blessing!</h2>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome!</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Get ready to achieve your academic goals.
              </p>
            </div>
            
            {/* Illustration Area */}
            <div className="w-24 h-24 ml-4 bg-green-200 rounded-xl flex items-center justify-center">
              <div className="relative">
                {/* Simple illustration replacement */}
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Course Outline */}
            <Link href="/course-outline">
              <div className="bg-white rounded-2xl p-6 border-2 border-green-200 hover:border-green-300 transition-all hover:shadow-md group">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 text-center">Course Outline</h4>
              </div>
            </Link>

            {/* Chat With AI */}
            <Link href="/chat">
              <div className="bg-white rounded-2xl p-6 border-2 border-green-200 hover:border-green-300 transition-all hover:shadow-md group">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">AI</span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 text-center">Chat With AI</h4>
              </div>
            </Link>

            {/* Bookmarks */}
            <Link href="/bookmarks">
              <div className="bg-white rounded-2xl p-6 border-2 border-green-200 hover:border-green-300 transition-all hover:shadow-md group">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Bookmark className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 text-center">Bookmarks</h4>
              </div>
            </Link>

            {/* Practice Exam */}
            <Link href="/practice-exam">
              <div className="bg-white rounded-2xl p-6 border-2 border-green-200 hover:border-green-300 transition-all hover:shadow-md group">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Settings className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 text-center">Practice Exam</h4>
              </div>
            </Link>
          </div>
        </div>

        {/* Additional Content for Desktop */}
        <div className="hidden lg:block mt-12">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Computer Science 101</p>
                  <p className="text-sm text-gray-500">Viewed course outline</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">AI Chat Session</p>
                  <p className="text-sm text-gray-500">Discussed algorithms</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Desktop Sidebar Navigation (hidden on mobile) */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">CourseAlign</h1>
          </div>
          
          <nav className="space-y-2">
            <Link href="/" className="flex items-center space-x-3 p-3 bg-green-50 text-green-700 rounded-xl">
              <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="w-3 h-3 bg-green-600 rounded"></span>
              </div>
              <span className="font-medium">Home</span>
            </Link>
            <Link href="/course-outline" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              <BookOpen className="w-6 h-6" />
              <span>Course Outline</span>
            </Link>
            <Link href="/chat" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              <MessageCircle className="w-6 h-6" />
              <span>Chat With AI</span>
            </Link>
            <Link href="/bookmarks" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              <Bookmark className="w-6 h-6" />
              <span>Bookmarks</span>
            </Link>
            <Link href="/practice-exam" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              <Settings className="w-6 h-6" />
              <span>Practice Exam</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Adjust main content margin for desktop sidebar */}
      <style jsx>{`
        @media (min-width: 1024px) {
          main {
            margin-left: 16rem;
          }
        }
      `}</style>
    </div>
  );
}