import { useMutation } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { kakaoComplete } from '../api/endpoints/auth'
import { useAuth } from '../auth/useAuth'
import { Button } from '../components/common/Button'
import { ErrorBanner } from '../components/common/ErrorBanner'
import { TextInput } from '../components/common/TextInput'
import { PublicLayout } from '../components/layout/PublicLayout'
import { getErrorCode, getErrorMessage } from '../lib/errors'

interface LocationState {
  signupToken: string
}

const PHONE_PATTERN = /^01[0-9]-\d{3,4}-\d{4}$/

export function KakaoCompleteProfilePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()
  const state = location.state as LocationState | null

  const [form, setForm] = useState({ nickname: '', email: '', name: '', birth: '', phoneNum: '' })
  const [clientError, setClientError] = useState<string | null>(null)

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const mutation = useMutation({
    mutationFn: () =>
      kakaoComplete({
        signup_token: state!.signupToken,
        nickname: form.nickname,
        email: form.email,
        name: form.name,
        birth: form.birth,
        phone_num: form.phoneNum,
      }),
    onSuccess: (result) => {
      if (result.status === 'authenticated') {
        login(result)
        navigate('/ingredients')
      }
    },
  })

  if (!state?.signupToken) {
    return <Navigate to="/login" replace />
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setClientError(null)
    if (!PHONE_PATTERN.test(form.phoneNum)) {
      setClientError('전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)')
      return
    }
    mutation.mutate()
  }

  const errorCode = mutation.isError ? getErrorCode(mutation.error) : null
  const fieldErrors: Record<string, string> = {
    email: errorCode === 'EMAIL_CONFLICT' ? '이미 사용 중인 이메일입니다.' : '',
    nickname: errorCode === 'NICKNAME_CONFLICT' ? '이미 사용 중인 닉네임입니다.' : '',
    phoneNum: errorCode === 'PHONE_NUM_CONFLICT' ? '이미 사용 중인 전화번호입니다.' : '',
  }
  const bannerMessage =
    clientError ??
    (mutation.isError && !fieldErrors.email && !fieldErrors.nickname && !fieldErrors.phoneNum
      ? getErrorMessage(mutation.error)
      : null)

  return (
    <PublicLayout>
      <p className="mb-4 text-sm text-gray-600">카카오 첫 로그인이에요. 추가 정보를 입력해주세요.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <TextInput
          label="닉네임 (2-20자)"
          required
          minLength={2}
          maxLength={20}
          value={form.nickname}
          onChange={(e) => update('nickname', e.target.value)}
          error={fieldErrors.nickname}
        />
        <TextInput
          label="이메일"
          type="email"
          required
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          error={fieldErrors.email}
        />
        <TextInput label="이름" required value={form.name} onChange={(e) => update('name', e.target.value)} />
        <TextInput
          label="생년월일"
          type="date"
          required
          value={form.birth}
          onChange={(e) => update('birth', e.target.value)}
        />
        <TextInput
          label="전화번호"
          placeholder="010-1234-5678"
          required
          value={form.phoneNum}
          onChange={(e) => update('phoneNum', e.target.value)}
          error={fieldErrors.phoneNum}
        />
        <ErrorBanner message={bannerMessage} />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? '가입 완료 중...' : '가입 완료'}
        </Button>
      </form>
    </PublicLayout>
  )
}
