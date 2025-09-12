interface CourseCardProps {
  course: {
    _id: string
    code: string
    title: string
    description: string
    level: number
    semester: string
    credits: number
    instructor: string
  }
  isBookmarked?: boolean
  onBookmark?: (courseId: string) => void
}

export function CourseCard({ course, isBookmarked, onBookmark }: CourseCardProps) {
  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{course.code}</h3>
          <p className="text-sm text-gray-500">
            Level {course.level} • {course.semester} • {course.credits} credits
          </p>
        </div>
        
        {onBookmark && (
          <button
            onClick={() => onBookmark(course._id)}
            className={`p-2 rounded-full ${
              isBookmarked
                ? 'text-yellow-500 bg-yellow-50'
                : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
            }`}
          >
            ★
          </button>
        )}
      </div>

      <h4 className="text-xl font-medium text-gray-900 mb-2">{course.title}</h4>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Instructor: {course.instructor}</span>
        <div className="space-x-2">
          <button className="text-blue-600 hover:text-blue-800">View Details</button>
          <button className="text-green-600 hover:text-green-800">Chat with AI</button>
        </div>
      </div>
    </div>
  )
}