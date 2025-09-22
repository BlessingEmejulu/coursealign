import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface QuickAccessCardProps {
  href: string
  icon?: LucideIcon
  title: string
  ariaLabel: string
  isAI?: boolean
}

export default function QuickAccessCard({ 
  href, 
  icon: IconComponent, 
  title, 
  ariaLabel, 
  isAI = false 
}: QuickAccessCardProps) {
  return (
    <Link 
      href={href}
      className="bg-white rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-300 transition-all hover:shadow-md group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={ariaLabel}
    >
      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
        {IconComponent ? (
          <IconComponent className="w-6 h-6 text-blue-600" aria-hidden="true" />
        ) : isAI ? (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm" aria-hidden="true">AI</span>
          </div>
        ) : null}
      </div>
      <h4 className="font-semibold text-gray-900 text-center">{title}</h4>
    </Link>
  )
}