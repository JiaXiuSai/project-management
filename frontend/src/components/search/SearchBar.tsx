import StatusFilterSelect from './StatusFilterSelect'
import TextSearchInput from './TextSearchInput'

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
      <TextSearchInput
        value={value}
        onChange={onChange}
        onClear={onClear}
        placeholder={placeholder}
      />
      {statuses.length > 0 && onStatusChange && (
        <StatusFilterSelect
          statuses={statuses}
          selectedStatus={selectedStatus}
          onStatusChange={onStatusChange}
        />
      )}
    </div>
  )
}

export default SearchBar
