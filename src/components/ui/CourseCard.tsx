import { Bookmark } from 'lucide-react'
import { Course } from '@/constants/courseData'

interface CourseCardProps {
  course: Course
  onBookmarkToggle: (courseId: string) => void
}

export default function CourseCard({ course, onBookmarkToggle }: CourseCardProps) {
  const handleBookmarkClick = () => {
    onBookmarkToggle(course.id)
  }

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-sm">
      {/* Course Info */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium">Course Code:</span> {course.code} 
          <span className="ml-2 font-medium">Unit(s):</span> {course.units}
        </p>
        <p className="text-sm text-gray-600 mb-3">
          <span className="font-medium">Course Title:</span> {course.title}
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-medium">Tags:</span> {course.level} Level | {course.semester} Semester | {course.department}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Get Course Outline
        </button>
        
        <button 
          onClick={handleBookmarkClick}
          className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            course.isBookmarked 
              ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
              : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
          }`}
          aria-label={course.isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
        >
          <Bookmark 
            className={`w-6 h-6 ${course.isBookmarked ? 'fill-current' : ''}`} 
            aria-hidden="true" 
          />
        </button>
      </div>
    </div>
  )
}