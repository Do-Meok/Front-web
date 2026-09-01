import { createContext } from 'react'

import type { LogInResponse, UserInfo } from '../types/api'

export interface AuthContextValue {
  user: UserInfo | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (response: LogInResponse) => void
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
