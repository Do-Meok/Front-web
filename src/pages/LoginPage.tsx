import { useMutation } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, type Location } from 'react-router-dom'

import { logIn } from '../api/endpoints/auth'
import { KAKAO_LOGIN_FROM_KEY, redirectToKakaoLogin } from '../auth/kakaoOAuth'
import { useAuth } from '../auth/useAuth'
import { Button } from '../components/common/Button'
import { ErrorBanner } from '../components/common/ErrorBanner'
import { TextInput } from '../components/common/TextInput'
import { PublicLayout } from '../components/layout/PublicLayout'
import { getErrorCode, getErrorMessage } from '../lib/errors'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const from = (location.state as { from?: Location } | null)?.from?.pathname ?? '/ingredients'

  const loginMutation = useMutation({
    mutationFn: () => logIn(email, password),
    onSuccess: (response) => {
      login(response)
      navigate(from, { replace: true })
    },
  })

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    loginMutation.mutate()
  }

  function handleKakaoLogin() {
    sessionStorage.setItem(KAKAO_LOGIN_FROM_KEY, from)
    redirectToKakaoLogin()
  }

  const errorMessage =
    loginMutation.isError && getErrorCode(loginMutation.error) === 'UNAUTHORIZED'
      ? '이메일 또는 비밀번호가 올바르지 않습니다.'
      : loginMutation.isError
        ? getErrorMessage(loginMutation.error)
        : null

  return (
    <PublicLayout>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          label="이메일"
          type="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          label="비밀번호"
          type="password"
          name="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <ErrorBanner message={errorMessage} />
        <Button type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? '로그인 중...' : '로그인'}
        </Button>
      </form>

      <div className="my-4 flex items-center gap-2 text-xs text-gray-400">
        <div className="h-px flex-1 bg-gray-200" />
        또는
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <Button
        type="button"
        variant="secondary"
        className="w-full bg-[#FEE500] text-black hover:bg-[#f5dc00]"
        onClick={handleKakaoLogin}
      >
        카카오로 로그인
      </Button>

      <div className="mt-6 flex justify-between text-xs text-gray-500">
        <Link to="/signup" className="hover:underline">
          회원가입
        </Link>
        <Link to="/password-reset" className="hover:underline">
          비밀번호 찾기
        </Link>
      </div>
    </PublicLayout>
  )
}
