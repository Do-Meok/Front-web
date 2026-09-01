import { useMutation } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { signupRequest } from '../api/endpoints/auth'
import { Button } from '../components/common/Button'
import { ErrorBanner } from '../components/common/ErrorBanner'
import { TextInput } from '../components/common/TextInput'
import { PublicLayout } from '../components/layout/PublicLayout'
import { getErrorCode, getErrorMessage } from '../lib/errors'

const PHONE_PATTERN = /^01[0-9]-\d{3,4}-\d{4}$/

export function SignupRequestPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
    checkedPassword: '',
    nickname: '',
    name: '',
    birth: '',
    phoneNum: '',
  })
  const [clientError, setClientError] = useState<string | null>(null)

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const mutation = useMutation({
    mutationFn: () =>
      signupRequest({
        email: form.email,
        password: form.password,
        checked_password: form.checkedPassword,
        nickname: form.nickname,
        name: form.name,
        birth: form.birth,
        phone_num: form.phoneNum,
      }),
    onSuccess: (response) => {
      navigate('/signup/verify', {
        state: { email: form.email, expiresInSeconds: response.expires_in_seconds, quotaRemaining: response.quota_remaining },
      })
    },
  })

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setClientError(null)

    if (form.password !== form.checkedPassword) {
      setClientError('비밀번호가 일치하지 않습니다.')
      return
    }
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
      ? errorCode === 'RATE_LIMIT_EXCEEDED'
        ? '오늘 인증 메일 발송 한도를 초과했습니다.'
        : getErrorMessage(mutation.error)
      : null)

  return (
    <PublicLayout>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <TextInput
          label="이메일"
          type="email"
          required
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          error={fieldErrors.email}
        />
        <TextInput
          label="비밀번호 (8-20자)"
          type="password"
          required
          minLength={8}
          maxLength={20}
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
        />
        <TextInput
          label="비밀번호 확인"
          type="password"
          required
          minLength={8}
          maxLength={20}
          value={form.checkedPassword}
          onChange={(e) => update('checkedPassword', e.target.value)}
        />
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
          label="이름"
          required
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
        />
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
          {mutation.isPending ? '가입 요청 중...' : '가입하기'}
        </Button>
      </form>
      <p className="mt-4 text-center text-xs text-gray-500">
        이미 계정이 있나요?{' '}
        <Link to="/login" className="text-orange-500 hover:underline">
          로그인
        </Link>
      </p>
    </PublicLayout>
  )
}
