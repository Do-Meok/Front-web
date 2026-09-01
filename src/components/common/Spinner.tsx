export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-gray-300 border-t-orange-500"
      style={{ width: size, height: size }}
      role="status"
      aria-label="로딩 중"
    />
  )
}
