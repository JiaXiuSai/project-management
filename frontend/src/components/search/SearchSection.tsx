import React from 'react'

import SearchBar from './SearchBar'
import SearchResults from './SearchResults'

interface SearchSectionProps {
  searchInput: string
  onSearchInputChange: (value: string) => void
  onClearSearch: () => void
  search: string
  totalResults: number
  loading: boolean
  statusFilter: string
  statuses: string[]
  onStatusFilterChange: (status: string) => void
}

const SearchSection: React.FC<SearchSectionProps> = ({
  searchInput,
  onSearchInputChange,
  onClearSearch,
  search,
  totalResults,
  loading,
  statusFilter,
  statuses,
  onStatusFilterChange,
}) => {
  return (
    <div className="mb-4">
      <SearchBar
        value={searchInput}
        onChange={onSearchInputChange}
        onClear={onClearSearch}
        placeholder="Search"
        statuses={statuses}
        selectedStatus={statusFilter}
        onStatusChange={onStatusFilterChange}
      />
      <SearchResults
        search={search}
        totalResults={totalResults}
        loading={loading}
        statusFilter={statusFilter}
      />
    </div>
  )
}

export default SearchSection
