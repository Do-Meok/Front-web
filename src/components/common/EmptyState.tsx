import type { ReactNode } from 'react'

export function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center text-sm text-gray-500">
      <p>{message}</p>
      {action}
    </div>
  )
}
