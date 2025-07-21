import { SearchIcon, X } from 'lucide-react'

import { IconButton } from '../buttons'

interface TextSearchInputProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  placeholder?: string
  className?: string
}

const TextSearchInput = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search',
  className = '',
}: TextSearchInputProps) => {
  return (
    <div className={`relative flex-1 ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <SearchIcon size={18} />
      </div>
      <input
        type="text"
        className="focus:ring-primary focus:border-primary w-full rounded border py-2 pl-10 pr-10 text-gray-900 transition-colors focus:outline-none focus:ring-2"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search projects"
        aria-describedby="search-description"
      />
      <div id="search-description" className="sr-only">
        Search projects by name, description, or status
      </div>
      {value && (
        <IconButton
          icon={X}
          onClick={onClear}
          className="absolute right-2 top-1/2 -translate-y-1/2"
          aria-label="Clear search"
        />
      )}
    </div>
  )
}

export default TextSearchInput
