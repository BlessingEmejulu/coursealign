interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: () => void
}

export default function SearchBar({ placeholder = 'Search...', value, onChange, onSearch }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={onSearch}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
      >
        🔍
      </button>
    </div>
  )
}