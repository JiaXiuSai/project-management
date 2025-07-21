type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null

  const PaginationButton = ({
    children,
    onClick,
    disabled = false,
    active = false,
  }: {
    children: React.ReactNode
    onClick: () => void
    disabled?: boolean
    active?: boolean
  }) => (
    <button
      className={`rounded border px-3 py-1 transition-colors ${
        active
          ? 'bg-primary hover:bg-primary-hover text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )

  return (
    <nav className="mt-6 flex items-center justify-center gap-2" aria-label="Project pagination">
      <PaginationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        Prev
      </PaginationButton>
      {Array.from({ length: totalPages }, (_, i) => (
        <PaginationButton
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          active={currentPage === i + 1}
          aria-label={`Go to page ${i + 1}`}
          aria-current={currentPage === i + 1 ? 'page' : undefined}
        >
          {i + 1}
        </PaginationButton>
      ))}
      <PaginationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        Next
      </PaginationButton>
    </nav>
  )
}

export default Pagination
