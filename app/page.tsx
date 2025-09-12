import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">CourseAlign</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="btn-secondary">
                Login
              </Link>
              <Link href="/auth/signup" className="btn-primary">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Welcome to</span>
            <span className="block text-blue-600">CourseAlign</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your intelligent learning companion. Access course outlines, chat with AI tutors, 
            and practice exams all in one place.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link href="/auth/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                Get Started
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link href="/courses" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                Browse Courses
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900">Course Access</h3>
              <p className="mt-2 text-sm text-gray-500">
                Browse and access all your departmental course outlines organized by level and semester.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900">AI Tutor</h3>
              <p className="mt-2 text-sm text-gray-500">
                Chat with Gemini-powered AI to discuss course topics and get instant explanations.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900">Exam Practice</h3>
              <p className="mt-2 text-sm text-gray-500">
                Practice with AI-generated questions and get instant feedback on your performance.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}