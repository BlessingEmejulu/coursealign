export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-50 h-screen border-r">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Navigation</h2>
        <nav className="space-y-2">
          <a href="/course-outline" className="block p-2 hover:bg-gray-200 rounded">
            📚 Course Outlines
          </a>
          <a href="/chat" className="block p-2 hover:bg-gray-200 rounded">
            💬 AI Chat
          </a>
          <a href="/bookmarks" className="block p-2 hover:bg-gray-200 rounded">
            🔖 Bookmarks
          </a>
          <a href="/practice-exam" className="block p-2 hover:bg-gray-200 rounded">
            📝 Practice Exams
          </a>
        </nav>
      </div>
    </aside>
  )
}