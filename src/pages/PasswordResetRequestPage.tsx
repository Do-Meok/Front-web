import { useMutation } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { passwordResetRequest } from '../api/endpoints/auth'
import { Button } from '../components/common/Button'
import { ErrorBanner } from '../components/common/ErrorBanner'
import { TextInput } from '../components/common/TextInput'
import { PublicLayout } from '../components/layout/PublicLayout'
import { getErrorCode, getErrorMessage } from '../lib/errors'

export function PasswordResetRequestPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  const mutation = useMutation({
    mutationFn: () => passwordResetRequest(email),
    onSuccess: () => navigate('/password-reset/confirm', { state: { email } }),
  })

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    mutation.mutate()
  }

  const isRateLimited = mutation.isError && getErrorCode(mutation.error) === 'RATE_LIMIT_EXCEEDED'
  const errorMessage = isRateLimited
    ? '오늘 인증 메일 발송 한도를 초과했습니다.'
    : mutation.isError
      ? getErrorMessage(mutation.error)
      : null

  return (
    <PublicLayout>
      <p className="mb-4 text-sm text-gray-600">가입한 이메일을 입력하면 인증 코드를 보내드려요.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <TextInput label="이메일" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <ErrorBanner message={errorMessage} />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? '전송 중...' : '인증 코드 받기'}
        </Button>
      </form>
      <p className="mt-4 text-center text-xs text-gray-500">
        <Link to="/login" className="text-orange-500 hover:underline">
          로그인으로 돌아가기
        </Link>
      </p>
    </PublicLayout>
  )
}
