import { SearchIcon, X } from 'lucide-react'

import { IconButton } from '../buttons'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  placeholder?: string
  className?: string
  statuses?: string[]
  selectedStatus?: string
  onStatusChange?: (status: string) => void
}

const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search',
  className = '',
  statuses = [],
  selectedStatus = '',
  onStatusChange,
}: SearchBarProps) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Search Input */}
      <div className="relative flex-1">
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

      {/* Status Filter */}
      {statuses.length > 0 && onStatusChange && (
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="focus:ring-primary focus:border-primary min-w-[140px] rounded border px-3 py-2 text-gray-900 transition-colors focus:outline-none focus:ring-2"
          aria-label="Filter projects by status"
        >
          <option value="">All Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}

export default SearchBar
