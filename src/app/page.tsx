import Link from 'next/link'
import { Search, Menu, BookOpen, MessageCircle, Bookmark, Settings } from 'lucide-react'
import { QUICK_ACCESS_ITEMS, RECENT_ACTIVITIES, USER_NAME } from '@/constants/homePageData'
import QuickAccessCard from '@/components/ui/QuickAccessCard'
import ActivityItem from '@/components/ui/ActivityItem'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header */}
      <header className="bg-white shadow-sm" role="banner">
        <div className="max-w-sm mx-auto lg:max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Hamburger Menu */}
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open navigation menu"
              type="button"
            >
              <Menu className="w-6 h-6 text-gray-700" aria-hidden="true" />
            </button>
            
            {/* Home Title */}
            <h1 className="text-xl font-semibold text-gray-900">Home</h1>
            
            {/* Profile Avatar */}
            <button 
              className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center"
              aria-label="User profile"
              type="button"
            >
              <BookOpen className="w-6 h-6 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-sm mx-auto lg:max-w-4xl px-4 py-6 space-y-6 lg:ml-64" role="main">
        {/* Greeting */}
        <section aria-labelledby="greeting-heading">
          <h2 id="greeting-heading" className="text-2xl font-bold text-gray-900 mb-4">Hi {USER_NAME}!</h2>
          
          {/* Search Bar */}
          <div className="relative">
            <label htmlFor="search-input" className="sr-only">Search courses and content</label>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
            <input
              id="search-input"
              type="search"
              placeholder="Search courses and content"
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              aria-describedby="search-description"
            />
            <div id="search-description" className="sr-only">
              Search for courses, topics, and learning materials
            </div>
          </div>
        </section>

        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome!</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Get ready to achieve your academic goals.
              </p>
            </div>
            
            {/* Illustration Area */}
            <div className="w-24 h-24 ml-4 bg-blue-200 rounded-xl flex items-center justify-center">
              <div className="relative">
                {/* Simple illustration replacement */}
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Section */}
        <section aria-labelledby="quick-access-heading">
          <h3 id="quick-access-heading" className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h3>
          
          <div className="grid grid-cols-2 gap-4" role="grid" aria-label="Quick access navigation">
            {QUICK_ACCESS_ITEMS.map((item) => (
              <QuickAccessCard 
                key={item.href}
                href={item.href}
                icon={item.icon}
                title={item.title}
                ariaLabel={item.ariaLabel}
                isAI={item.isAI}
              />
            ))}
          </div>
        </section>

        {/* Additional Content for Desktop */}
        <section className="hidden lg:block mt-12" aria-labelledby="recent-activity-heading">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 id="recent-activity-heading" className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <ul className="space-y-3" role="list" aria-label="Recent learning activities">
              {RECENT_ACTIVITIES.map((activity, index) => (
                <ActivityItem 
                  key={index}
                  icon={activity.icon}
                  title={activity.title}
                  description={activity.description}
                  bgColor={activity.bgColor}
                  iconColor={activity.iconColor}
                />
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* Desktop Sidebar Navigation (hidden on mobile) */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">CourseAlign</h1>
          </div>
          
          <nav className="space-y-2">
            <Link href="/" className="flex items-center space-x-3 p-3 bg-blue-50 text-blue-700 rounded-xl">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="w-3 h-3 bg-blue-600 rounded"></span>
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


    </div>
  );
}