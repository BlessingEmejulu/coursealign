import { LucideIcon } from 'lucide-react'

interface ActivityItemProps {
  icon: LucideIcon
  title: string
  description: string
  bgColor: string
  iconColor: string
}

export default function ActivityItem({ 
  icon: IconComponent, 
  title, 
  description, 
  bgColor, 
  iconColor 
}: ActivityItemProps) {
  return (
    <li className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
      <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
        <IconComponent className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />
      </div>
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </li>
  )
}