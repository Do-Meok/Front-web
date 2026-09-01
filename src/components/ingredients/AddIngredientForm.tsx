import type { FormEvent } from 'react'

import { Button } from '../common/Button'

interface AddIngredientFormProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function AddIngredientForm({ value, onChange, onSubmit, isSubmitting }: AddIngredientFormProps) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="ingredient-input" className="text-sm font-medium text-gray-700">
        재료 추가 (쉼표 또는 줄바꿈으로 구분)
      </label>
      <textarea
        id="ingredient-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="예: 양파, 대파, 두부"
        rows={3}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
      />
      <Button type="submit" disabled={isSubmitting || value.trim().length === 0}>
        {isSubmitting ? '추가 중...' : '추가하기'}
      </Button>
    </form>
  )
}
