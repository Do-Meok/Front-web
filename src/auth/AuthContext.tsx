import { useEffect, useState, type ReactNode } from 'react'

import { refreshSession, registerAuthHandlers } from '../api/client'
import { logOut as logOutRequest } from '../api/endpoints/auth'
import type { LogInResponse, UserInfo } from '../types/api'
import { AuthContext } from './context'
import { clearTokens, getRefreshToken, setAccessToken, setRefreshToken } from './tokenStorage'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(() => Boolean(getRefreshToken()))

  function login(response: LogInResponse) {
    setAccessToken(response.access_token)
    setRefreshToken(response.refresh_token)
    setUser(response.info)
  }

  async function logout() {
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      try {
        await logOutRequest(refreshToken)
      } catch {
        // best-effort: 서버 로그아웃이 실패해도 클라이언트 상태는 정리한다.
      }
    }
    clearTokens()
    setUser(null)
  }

  useEffect(() => {
    registerAuthHandlers({
      onRefreshed: (response) => setUser(response.info),
      onAuthFailure: () => setUser(null),
    })
  }, [])

  useEffect(() => {
    if (!getRefreshToken()) {
      return
    }
    // refreshSession()은 동시 호출을 하나의 네트워크 요청으로 묶어주므로
    // React StrictMode의 이펙트 중복 실행에도 refresh_token이 두 번 소모되지 않는다.
    refreshSession()
      .catch(() => undefined)
      .finally(() => setIsLoading(false))
  }, [])

  const value = { user, isAuthenticated: user !== null, isLoading, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
