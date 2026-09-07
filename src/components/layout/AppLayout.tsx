import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/ingredients', label: '재료' },
  { to: '/recommendations', label: '추천받기' },
  { to: '/saved', label: '저장한 레시피' },
  { to: '/mypage', label: '마이페이지' },
]

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto flex max-w-4xl items-center gap-1 px-4 py-3">
          <span className="mr-4 text-lg font-bold text-orange-500">두고먹고</span>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
