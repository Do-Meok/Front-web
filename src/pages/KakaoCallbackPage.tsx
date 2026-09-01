import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { kakaoLoginWeb } from '../api/endpoints/auth'
import { KAKAO_LOGIN_FROM_KEY, getKakaoRedirectUri } from '../auth/kakaoOAuth'
import { useAuth } from '../auth/useAuth'
import { ErrorBanner } from '../components/common/ErrorBanner'
import { Spinner } from '../components/common/Spinner'
import { PublicLayout } from '../components/layout/PublicLayout'
import { getErrorMessage } from '../lib/errors'

export function KakaoCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const code = searchParams.get('code')
  const kakaoError = searchParams.get('error')

  const mutation = useMutation({
    mutationFn: (authCode: string) => kakaoLoginWeb(authCode, getKakaoRedirectUri()),
    onSuccess: (result) => {
      const from = sessionStorage.getItem(KAKAO_LOGIN_FROM_KEY) ?? '/ingredients'
      sessionStorage.removeItem(KAKAO_LOGIN_FROM_KEY)
      if (result.status === 'authenticated') {
        login(result)
        navigate(from, { replace: true })
      } else {
        navigate('/kakao/complete-profile', { replace: true, state: { signupToken: result.signup_token } })
      }
    },
  })

  useEffect(() => {
    if (code) {
      mutation.mutate(code)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  if (kakaoError || !code) {
    return (
      <PublicLayout>
        <ErrorBanner message="카카오 로그인이 취소되었거나 실패했습니다." />
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <div className="flex flex-col items-center gap-3 py-6">
        {mutation.isError ? (
          <ErrorBanner message={getErrorMessage(mutation.error, '카카오 로그인에 실패했습니다.')} />
        ) : (
          <>
            <Spinner />
            <p className="text-sm text-gray-500">카카오 로그인 처리 중...</p>
          </>
        )}
      </div>
    </PublicLayout>
  )
}
