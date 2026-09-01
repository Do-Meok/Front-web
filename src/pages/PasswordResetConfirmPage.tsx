import { useMutation } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { passwordResetConfirm } from '../api/endpoints/auth'
import { Button } from '../components/common/Button'
import { ErrorBanner } from '../components/common/ErrorBanner'
import { TextInput } from '../components/common/TextInput'
import { PublicLayout } from '../components/layout/PublicLayout'
import { getErrorCode, getErrorMessage } from '../lib/errors'

interface LocationState {
  email: string
}

export function PasswordResetConfirmPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | null

  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [checkedNewPassword, setCheckedNewPassword] = useState('')
  const [clientError, setClientError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: () => passwordResetConfirm(state!.email, code, newPassword, checkedNewPassword),
    onSuccess: () => navigate('/login', { state: { passwordResetDone: true } }),
  })

  if (!state?.email) {
    return <Navigate to="/password-reset" replace />
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setClientError(null)
    if (newPassword !== checkedNewPassword) {
      setClientError('새 비밀번호가 일치하지 않습니다.')
      return
    }
    mutation.mutate()
  }

  const invalidCode = mutation.isError && getErrorCode(mutation.error) === 'INVALID_VERIFICATION_CODE'
  const bannerMessage =
    clientError ??
    (mutation.isError && !invalidCode ? getErrorMessage(mutation.error) : null)

  return (
    <PublicLayout>
      <p className="mb-4 text-sm text-gray-600">
        <strong>{state.email}</strong>로 받은 인증 코드와 새 비밀번호를 입력하세요.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <TextInput
          label="인증 코드 (6자리)"
          inputMode="numeric"
          maxLength={6}
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          error={invalidCode ? '인증 코드가 올바르지 않습니다.' : undefined}
        />
        <TextInput
          label="새 비밀번호 (8-20자)"
          type="password"
          minLength={8}
          maxLength={20}
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextInput
          label="새 비밀번호 확인"
          type="password"
          minLength={8}
          maxLength={20}
          required
          value={checkedNewPassword}
          onChange={(e) => setCheckedNewPassword(e.target.value)}
        />
        <ErrorBanner message={bannerMessage} />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? '변경 중...' : '비밀번호 변경'}
        </Button>
      </form>
    </PublicLayout>
  )
}
