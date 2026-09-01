import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { clearTokens, getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from '../auth/tokenStorage'
import type { LogInResponse } from '../types/api'

const baseURL = import.meta.env.VITE_API_BASE_URL

// 이 경로들은 토큰이 없거나 있어도 무의미하므로 Authorization 헤더를 붙이지 않는다.
const PUBLIC_AUTH_PATHS = [
  '/auth/log-in',
  '/auth/refresh',
  '/auth/kakao/web',
  '/auth/kakao/complete',
  '/auth/signup/request',
  '/auth/signup/verify',
  '/auth/signup/resend',
  '/auth/password/reset/request',
  '/auth/password/reset/confirm',
]

function isPublicAuthPath(url?: string): boolean {
  if (!url) return false
  return PUBLIC_AUTH_PATHS.some((path) => url.includes(path))
}

export const apiClient = axios.create({ baseURL })

let onRefreshed: ((response: LogInResponse) => void) | null = null
let onAuthFailure: (() => void) | null = null

export function registerAuthHandlers(handlers: {
  onRefreshed: (response: LogInResponse) => void
  onAuthFailure: () => void
}): void {
  onRefreshed = handlers.onRefreshed
  onAuthFailure = handlers.onAuthFailure
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!isPublicAuthPath(config.url)) {
    const token = getAccessToken()
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`)
    }
  }
  return config
})

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

// refresh_token은 1회용 회전 방식이라, 동시에 여러 요청이 refresh를 트리거해도
// 실제 네트워크 호출은 반드시 한 번만 나가야 한다. 그렇지 않으면 서로의 새 토큰을 무효화시키는 레이스가 생긴다.
// (React StrictMode가 마운트 이펙트를 두 번 실행하는 개발 모드에서도 동일한 문제가 발생한다.)
let refreshPromise: Promise<LogInResponse> | null = null

async function performRefresh(): Promise<LogInResponse> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw new Error('no refresh token')
  }
  // 재귀 방지를 위해 인터셉터가 걸린 apiClient가 아닌 순수 axios로 호출한다.
  const response = await axios.post<LogInResponse>(`${baseURL}/auth/refresh`, {
    refresh_token: refreshToken,
  })
  return response.data
}

export async function refreshSession(): Promise<LogInResponse> {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null
    })
  }

  try {
    const refreshed = await refreshPromise
    setAccessToken(refreshed.access_token)
    setRefreshToken(refreshed.refresh_token)
    onRefreshed?.(refreshed)
    return refreshed
  } catch (error) {
    clearTokens()
    onAuthFailure?.()
    throw error
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined

    if (
      error.response?.status !== 401 ||
      !config ||
      config._retry ||
      isPublicAuthPath(config.url)
    ) {
      return Promise.reject(error)
    }

    config._retry = true

    try {
      const refreshed = await refreshSession()
      config.headers.set('Authorization', `Bearer ${refreshed.access_token}`)
      return apiClient(config)
    } catch (refreshError) {
      return Promise.reject(refreshError)
    }
  },
)
