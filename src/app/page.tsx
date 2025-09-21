import Link from 'next/link'
import { BookOpen, MessageCircle, FileText, Star, Users, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CourseAlign
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/course-outline" className="text-gray-700 hover:text-blue-600 transition-colors">
                Courses
              </Link>
              <Link href="/chat" className="text-gray-700 hover:text-blue-600 transition-colors">
                AI Tutor
              </Link>
              <Link href="/practice-exam" className="text-gray-700 hover:text-blue-600 transition-colors">
                Practice
              </Link>
              <Link href="/bookmarks" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Hi <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Blessing</span>! 👋
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Welcome to CourseAlign - Your intelligent learning companion. Access course outlines, 
            chat with AI tutors, and practice exams all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/course-outline" className="btn-primary text-lg px-8 py-3">
              Browse Courses
            </Link>
            <Link href="/chat" className="btn-secondary text-lg px-8 py-3">
              Start AI Chat
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/course-outline" className="group">
            <div className="card hover:shadow-xl transition-all duration-300 group-hover:scale-105 border-l-4 border-blue-500">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Course Outlines</h3>
              </div>
              <p className="text-gray-600">
                Browse courses by level and semester. Access detailed course outlines and materials.
              </p>
            </div>
          </Link>

          <Link href="/chat" className="group">
            <div className="card hover:shadow-xl transition-all duration-300 group-hover:scale-105 border-l-4 border-green-500">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">AI Tutor</h3>
              </div>
              <p className="text-gray-600">
                Chat with Gemini-powered AI to discuss course topics and get instant explanations.
              </p>
            </div>
          </Link>

          <Link href="/practice-exam" className="group">
            <div className="card hover:shadow-xl transition-all duration-300 group-hover:scale-105 border-l-4 border-purple-500">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Practice Exams</h3>
              </div>
              <p className="text-gray-600">
                Take AI-generated practice tests and get instant feedback on your performance.
              </p>
            </div>
          </Link>

          <Link href="/bookmarks" className="group">
            <div className="card hover:shadow-xl transition-all duration-300 group-hover:scale-105 border-l-4 border-orange-500">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Bookmarks</h3>
              </div>
              <p className="text-gray-600">
                Save your favorite courses and topics for quick access later.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose CourseAlign?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for students who want to excel in their academic journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Learning</h3>
              <p className="text-gray-600">
                Get personalized explanations and practice questions generated by advanced AI
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Organized Content</h3>
              <p className="text-gray-600">
                Access all your course materials in one organized, easy-to-navigate platform
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your learning progress and get insights to improve your performance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who are already using CourseAlign to excel in their studies
          </p>
          <Link href="/course-outline" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
            Start Learning Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">CourseAlign</h3>
              </div>
              <p className="text-gray-400">
                Your intelligent learning companion for academic success.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/course-outline" className="hover:text-white transition-colors">Course Outlines</Link></li>
                <li><Link href="/chat" className="hover:text-white transition-colors">AI Tutor</Link></li>
                <li><Link href="/practice-exam" className="hover:text-white transition-colors">Practice Exams</Link></li>
                <li><Link href="/bookmarks" className="hover:text-white transition-colors">Bookmarks</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <p className="text-gray-400 mb-4">
                Stay updated with the latest features and tips
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CourseAlign. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}