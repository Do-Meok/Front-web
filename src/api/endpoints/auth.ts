import { apiClient } from '../client'
import type { KakaoLoginResult, LogInResponse, PasswordResetAcceptedResponse, SignupAcceptedResponse } from '../../types/api'

export function logIn(email: string, password: string) {
  return apiClient.post<LogInResponse>('/auth/log-in', { email, password }).then((r) => r.data)
}

export function logOut(refreshToken: string) {
  return apiClient.post<{ message: string }>('/auth/log-out', { refresh_token: refreshToken }).then((r) => r.data)
}

export function kakaoLoginWeb(code: string, redirectUri: string) {
  return apiClient
    .post<KakaoLoginResult>('/auth/kakao/web', { code, redirect_uri: redirectUri })
    .then((r) => r.data)
}

export interface KakaoCompletePayload {
  signup_token: string
  nickname: string
  email: string
  name: string
  birth: string
  phone_num: string
}

export function kakaoComplete(payload: KakaoCompletePayload) {
  return apiClient.post<KakaoLoginResult>('/auth/kakao/complete', payload).then((r) => r.data)
}

export interface SignupRequestPayload {
  email: string
  password: string
  checked_password: string
  nickname: string
  name: string
  birth: string
  phone_num: string
}

export function signupRequest(payload: SignupRequestPayload) {
  return apiClient.post<SignupAcceptedResponse>('/auth/signup/request', payload).then((r) => r.data)
}

export function signupVerify(email: string, code: string) {
  return apiClient.post<LogInResponse>('/auth/signup/verify', { email, code }).then((r) => r.data)
}

export function signupResend(email: string) {
  return apiClient.post<SignupAcceptedResponse>('/auth/signup/resend', { email }).then((r) => r.data)
}

export function passwordResetRequest(email: string) {
  return apiClient
    .post<PasswordResetAcceptedResponse>('/auth/password/reset/request', { email })
    .then((r) => r.data)
}

export function passwordResetConfirm(
  email: string,
  code: string,
  newPassword: string,
  checkedNewPassword: string,
) {
  return apiClient
    .post<{ message: string }>('/auth/password/reset/confirm', {
      email,
      code,
      new_password: newPassword,
      checked_new_password: checkedNewPassword,
    })
    .then((r) => r.data)
}
