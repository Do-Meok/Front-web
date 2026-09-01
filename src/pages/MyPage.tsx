import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/useAuth'
import { Button } from '../components/common/Button'
import { ErrorBanner } from '../components/common/ErrorBanner'
import { Spinner } from '../components/common/Spinner'
import { TextInput } from '../components/common/TextInput'
import { useMeQuery, useUpdateNicknameMutation, useUpdatePasswordMutation } from '../hooks/useUser'
import { getErrorCode, getErrorMessage } from '../lib/errors'

export function MyPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { data: me, isLoading } = useMeQuery()

  const [isEditingNickname, setIsEditingNickname] = useState(false)
  const [nicknameDraft, setNicknameDraft] = useState('')
  const nicknameMutation = useUpdateNicknameMutation()

  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', checkedNext: '' })
  const [passwordClientError, setPasswordClientError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const passwordMutation = useUpdatePasswordMutation()

  function startEditNickname() {
    setNicknameDraft(me?.nickname ?? '')
    setIsEditingNickname(true)
  }

  function handleNicknameSave() {
    nicknameMutation.mutate(nicknameDraft, { onSuccess: () => setIsEditingNickname(false) })
  }

  function handlePasswordSubmit(event: FormEvent) {
    event.preventDefault()
    setPasswordClientError(null)
    setPasswordSuccess(false)
    if (passwordForm.next !== passwordForm.checkedNext) {
      setPasswordClientError('새 비밀번호가 일치하지 않습니다.')
      return
    }
    passwordMutation.mutate(
      { currentPassword: passwordForm.current, newPassword: passwordForm.next, checkedNewPassword: passwordForm.checkedNext },
      {
        onSuccess: () => {
          setPasswordSuccess(true)
          setPasswordForm({ current: '', next: '', checkedNext: '' })
        },
      },
    )
  }

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  if (isLoading || !me) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    )
  }

  const nicknameConflict = nicknameMutation.isError && getErrorCode(nicknameMutation.error) === 'NICKNAME_CONFLICT'
  const passwordUnauthorized = passwordMutation.isError && getErrorCode(passwordMutation.error) === 'UNAUTHORIZED'

  return (
    <div className="flex max-w-lg flex-col gap-8">
      <div>
        <h1 className="mb-4 text-lg font-bold text-gray-900">마이페이지</h1>
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <InfoRow label="이메일" value={me.email} />
          <InfoRow label="이름" value={me.name} />
          <InfoRow label="생년월일" value={me.birth} />

          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-sm text-gray-500">닉네임</span>
            {isEditingNickname ? (
              <div className="flex items-center gap-2">
                <input
                  value={nicknameDraft}
                  onChange={(e) => setNicknameDraft(e.target.value)}
                  className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
                  maxLength={20}
                  minLength={2}
                />
                <Button onClick={handleNicknameSave} disabled={nicknameMutation.isPending}>
                  저장
                </Button>
                <Button variant="secondary" onClick={() => setIsEditingNickname(false)}>
                  취소
                </Button>
              </div>
            ) : (
              <button onClick={startEditNickname} className="text-sm font-medium text-gray-900 hover:text-orange-500">
                {me.nickname} ✏️
              </button>
            )}
          </div>
          {nicknameConflict && <ErrorBanner message="이미 사용 중인 닉네임입니다." />}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-gray-900">비밀번호 변경</h2>
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <TextInput
            label="현재 비밀번호"
            type="password"
            required
            value={passwordForm.current}
            onChange={(e) => setPasswordForm((prev) => ({ ...prev, current: e.target.value }))}
            error={passwordUnauthorized ? '현재 비밀번호가 올바르지 않습니다.' : undefined}
          />
          <TextInput
            label="새 비밀번호 (8-20자)"
            type="password"
            minLength={8}
            maxLength={20}
            required
            value={passwordForm.next}
            onChange={(e) => setPasswordForm((prev) => ({ ...prev, next: e.target.value }))}
          />
          <TextInput
            label="새 비밀번호 확인"
            type="password"
            minLength={8}
            maxLength={20}
            required
            value={passwordForm.checkedNext}
            onChange={(e) => setPasswordForm((prev) => ({ ...prev, checkedNext: e.target.value }))}
          />
          <ErrorBanner
            message={
              passwordClientError ?? (passwordMutation.isError && !passwordUnauthorized ? getErrorMessage(passwordMutation.error) : null)
            }
          />
          {passwordSuccess && <p className="text-sm text-green-600">비밀번호가 변경되었습니다.</p>}
          <Button type="submit" disabled={passwordMutation.isPending}>
            {passwordMutation.isPending ? '변경 중...' : '비밀번호 변경'}
          </Button>
        </form>
      </div>

      <Button variant="secondary" onClick={handleLogout} className="self-start">
        로그아웃
      </Button>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}
