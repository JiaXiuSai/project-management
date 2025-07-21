interface StatusFilterSelectProps {
  statuses: string[]
  selectedStatus: string
  onStatusChange: (status: string) => void
  className?: string
}

const StatusFilterSelect = ({
  statuses,
  selectedStatus,
  onStatusChange,
  className = '',
}: StatusFilterSelectProps) => {
  return (
    <select
      value={selectedStatus}
      onChange={(e) => onStatusChange(e.target.value)}
      className={`focus:ring-primary focus:border-primary min-w-[140px] rounded border px-3 py-2 text-gray-900 transition-colors focus:outline-none focus:ring-2 ${className}`}
      aria-label="Filter projects by status"
    >
      <option value="">All Statuses</option>
      {statuses.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  )
}

export default StatusFilterSelect
