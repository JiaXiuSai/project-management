interface SearchResultsProps {
  search: string
  totalResults: number
  loading: boolean
  statusFilter?: string
  className?: string
}

const SearchResults = ({
  search,
  totalResults,
  loading,
  statusFilter,
  className = '',
}: SearchResultsProps) => {
  if (!search && !statusFilter) return null

  return (
    <div className={`mt-1 min-h-[20px] text-sm text-gray-500 ${className}`}>
      {loading ? (
        <div>
          {search && `Searching for: "${search}"`}
          {search && statusFilter && ' • '}
          {statusFilter && `Filtering by: ${statusFilter}`}
          ...
        </div>
      ) : (
        <div>
          {search && `Searching for: "${search}"`}
          {search && statusFilter && ' • '}
          {statusFilter && `Filtering by: ${statusFilter}`}
          {(search || statusFilter) && ` • ${totalResults} result${totalResults !== 1 ? 's' : ''}`}
        </div>
      )}
    </div>
  )
}

export default SearchResults
