import type { ReactNode } from 'react'

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-orange-500">두고먹고</h1>
        {children}
      </div>
    </div>
  )
}
