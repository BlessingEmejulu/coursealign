import { BookOpen, MessageCircle, Bookmark, Settings } from 'lucide-react'

export const QUICK_ACCESS_ITEMS = [
  {
    href: '/course-outline',
    icon: BookOpen,
    title: 'Course Outline',
    ariaLabel: 'Access course outlines and materials',
    isAI: false
  },
  {
    href: '/chat',
    icon: undefined, // No icon for AI - will show custom AI badge
    title: 'Chat With AI',
    ariaLabel: 'Chat with AI tutor for help',
    isAI: true
  },
  {
    href: '/bookmarks',
    icon: Bookmark,
    title: 'Bookmarks',
    ariaLabel: 'View your saved bookmarks',
    isAI: false
  },
  {
    href: '/practice-exam',
    icon: Settings,
    title: 'Practice Exam',
    ariaLabel: 'Take practice examinations',
    isAI: false
  }
] as const

export const RECENT_ACTIVITIES = [
  {
    icon: BookOpen,
    title: 'Computer Science 101',
    description: 'Viewed course outline',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    icon: MessageCircle,
    title: 'AI Chat Session',
    description: 'Discussed algorithms',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  }
] as const

export const USER_NAME = 'Blessing' as const