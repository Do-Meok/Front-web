import { useMutation } from '@tanstack/react-query'
import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { signupResend, signupVerify } from '../api/endpoints/auth'
import { useAuth } from '../auth/useAuth'
import { Button } from '../components/common/Button'
import { ErrorBanner } from '../components/common/ErrorBanner'
import { QuotaBadge } from '../components/common/QuotaBadge'
import { TextInput } from '../components/common/TextInput'
import { PublicLayout } from '../components/layout/PublicLayout'
import { getErrorCode, getErrorMessage } from '../lib/errors'

interface LocationState {
  email: string
  expiresInSeconds: number
  quotaRemaining: number
}

export function SignupVerifyPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()
  const state = location.state as LocationState | null

  const [code, setCode] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(state?.expiresInSeconds ?? 0)
  const [quotaRemaining, setQuotaRemaining] = useState(state?.quotaRemaining ?? 0)

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(timer)
  }, [secondsLeft])

  const verifyMutation = useMutation({
    mutationFn: () => signupVerify(state!.email, code),
    onSuccess: (response) => {
      login(response)
      navigate('/ingredients')
    },
  })

  const resendMutation = useMutation({
    mutationFn: () => signupResend(state!.email),
    onSuccess: (response) => {
      setSecondsLeft(response.expires_in_seconds)
      setQuotaRemaining(response.quota_remaining)
    },
  })

  if (!state?.email) {
    return <Navigate to="/signup" replace />
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    verifyMutation.mutate()
  }

  const verifyErrorCode = verifyMutation.isError ? getErrorCode(verifyMutation.error) : null
  const verifyMessage =
    verifyErrorCode === 'INVALID_VERIFICATION_CODE'
      ? '인증 코드가 올바르지 않거나 만료되었습니다.'
      : verifyMutation.isError
        ? getErrorMessage(verifyMutation.error)
        : null

  const resendErrorCode = resendMutation.isError ? getErrorCode(resendMutation.error) : null
  const resendMessage =
    resendErrorCode === 'RATE_LIMIT_EXCEEDED' || resendErrorCode === 'VERIFICATION_COOLDOWN'
      ? '잠시 후 다시 시도해주세요.'
      : resendMutation.isError
        ? getErrorMessage(resendMutation.error)
        : null

  return (
    <PublicLayout>
      <p className="mb-2 text-sm text-gray-600">
        <strong>{state.email}</strong>로 인증 코드를 보냈어요.
      </p>
      <QuotaBadge label="오늘 남은 재전송 횟수" remaining={quotaRemaining} total={5} />

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <TextInput
          label="인증 코드 (6자리)"
          inputMode="numeric"
          maxLength={6}
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <p className="text-xs text-gray-400">
          {secondsLeft > 0 ? `남은 시간: ${Math.floor(secondsLeft / 60)}분 ${secondsLeft % 60}초` : '인증 코드가 만료되었을 수 있어요.'}
        </p>
        <ErrorBanner message={verifyMessage} />
        <Button type="submit" disabled={verifyMutation.isPending || code.length !== 6}>
          {verifyMutation.isPending ? '확인 중...' : '인증하기'}
        </Button>
      </form>

      <div className="mt-4 flex flex-col items-center gap-1">
        <Button
          type="button"
          variant="secondary"
          onClick={() => resendMutation.mutate()}
          disabled={resendMutation.isPending}
        >
          {resendMutation.isPending ? '재전송 중...' : '코드 재전송'}
        </Button>
        <ErrorBanner message={resendMessage} />
      </div>
    </PublicLayout>
  )
}
