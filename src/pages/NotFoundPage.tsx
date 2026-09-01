import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-lg font-semibold text-gray-700">페이지를 찾을 수 없어요.</p>
      <Link to="/" className="text-orange-500 hover:underline">
        홈으로 돌아가기
      </Link>
    </div>
  )
}
