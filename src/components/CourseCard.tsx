interface Course {
  id: string
  code: string
  title: string
  description: string
  level: number
  semester: string
  credits: number
}

interface CourseCardProps {
  course: Course
  onBookmark?: (courseId: string) => void
  isBookmarked?: boolean
}

export default function CourseCard({ course, onBookmark, isBookmarked }: CourseCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{course.code}</h3>
          <p className="text-sm text-gray-500">
            Level {course.level} • {course.semester} • {course.credits} credits
          </p>
        </div>
        {onBookmark && (
          <button
            onClick={() => onBookmark(course.id)}
            className={`text-xl ${isBookmarked ? 'text-yellow-500' : 'text-gray-300'}`}
          >
            ★
          </button>
        )}
      </div>
      <h4 className="text-xl font-medium mb-2">{course.title}</h4>
      <p className="text-gray-600 text-sm">{course.description}</p>
    </div>
  )
}