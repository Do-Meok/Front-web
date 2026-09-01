import { apiClient } from '../client'
import type { UserInfo } from '../../types/api'

export function getMe() {
  return apiClient.get<UserInfo>('/users/me').then((r) => r.data)
}

export function updateNickname(nickname: string) {
  return apiClient.patch<UserInfo>('/users/me', { nickname }).then((r) => r.data)
}

export function updatePassword(currentPassword: string, newPassword: string, checkedNewPassword: string) {
  return apiClient
    .patch<UserInfo>('/users/me/password', {
      current_password: currentPassword,
      new_password: newPassword,
      checked_new_password: checkedNewPassword,
    })
    .then((r) => r.data)
}
