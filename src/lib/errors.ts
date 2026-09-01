import { isAxiosError } from 'axios'
import type { ApiError } from '../types/api'

export function getErrorCode(error: unknown): string | null {
  if (isAxiosError<ApiError>(error)) {
    return error.response?.data?.code ?? null
  }
  return null
}

export function getErrorMessage(error: unknown, fallback = '알 수 없는 오류가 발생했습니다.'): string {
  if (isAxiosError<ApiError>(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string' && detail.length > 0) {
      return detail
    }
    if (Array.isArray(detail) && detail.length > 0) {
      return detail[0]?.msg ?? fallback
    }
  }
  return fallback
}
