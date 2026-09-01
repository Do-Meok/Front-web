export function QuotaBadge({ label, remaining, total }: { label: string; remaining: number; total: number }) {
  const exhausted = remaining <= 0
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        exhausted ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
      }`}
    >
      {label}: {remaining}/{total}
    </span>
  )
}
