export function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600" role="alert">
      {message}
    </div>
  )
}
