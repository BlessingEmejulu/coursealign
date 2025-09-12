import Link from 'next/link'
import { User, BookOpen, MessageCircle, FileText, LogOut } from 'lucide-react'

interface NavbarProps {
  user?: {
    name: string
    email: string
  }
}

export function Navbar({ user }: NavbarProps) {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              CourseAlign
            </Link>
          </div>

          {user ? (
            <div className="flex items-center space-x-6">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 flex items-center space-x-1"
              >
                <User className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              
              <Link
                href="/courses"
                className="text-gray-700 hover:text-blue-600 flex items-center space-x-1"
              >
                <BookOpen className="w-4 h-4" />
                <span>Courses</span>
              </Link>
              
              <Link
                href="/chat"
                className="text-gray-700 hover:text-blue-600 flex items-center space-x-1"
              >
                <MessageCircle className="w-4 h-4" />
                <span>AI Tutor</span>
              </Link>
              
              <Link
                href="/exam"
                className="text-gray-700 hover:text-blue-600 flex items-center space-x-1"
              >
                <FileText className="w-4 h-4" />
                <span>Exam Practice</span>
              </Link>

              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">{user.name}</span>
                <button className="text-gray-500 hover:text-red-600">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="btn-secondary">
                Login
              </Link>
              <Link href="/auth/signup" className="btn-primary">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}