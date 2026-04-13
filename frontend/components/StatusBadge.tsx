type Status = 'pending' | 'confirmed' | 'cancelled' | 'completed'

const styles: Record<Status, string> = {
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
}

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${styles[status]}`}>
      {status}
    </span>
  )
}