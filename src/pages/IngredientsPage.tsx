import { useState } from 'react'

import { AddIngredientForm } from '../components/ingredients/AddIngredientForm'
import { IngredientList } from '../components/ingredients/IngredientList'
import { ReceiptUploadButton } from '../components/ingredients/ReceiptUploadButton'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorBanner } from '../components/common/ErrorBanner'
import { Spinner } from '../components/common/Spinner'
import { useAddIngredientsMutation, useDeleteAllIngredientsMutation, useIngredientsQuery } from '../hooks/useIngredients'
import { getErrorMessage } from '../lib/errors'

function parseIngredientInput(value: string): string[] {
  return value
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

export function IngredientsPage() {
  const { data: ingredients, isLoading, isError, error } = useIngredientsQuery()
  const addMutation = useAddIngredientsMutation()
  const deleteAllMutation = useDeleteAllIngredientsMutation()
  const [draft, setDraft] = useState('')

  function handleAdd() {
    const parsed = parseIngredientInput(draft)
    if (parsed.length === 0) return
    addMutation.mutate(parsed, { onSuccess: () => setDraft('') })
  }

  function handleDeleteAll() {
    if (window.confirm('보유한 재료를 모두 삭제할까요?')) {
      deleteAllMutation.mutate()
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">내 재료</h1>
        {ingredients && ingredients.length > 0 && (
          <Button variant="danger" onClick={handleDeleteAll} disabled={deleteAllMutation.isPending}>
            전체 삭제
          </Button>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <AddIngredientForm value={draft} onChange={setDraft} onSubmit={handleAdd} isSubmitting={addMutation.isPending} />
        <ErrorBanner message={addMutation.isError ? getErrorMessage(addMutation.error) : null} />
        <div className="mt-3 border-t border-gray-100 pt-3">
          <ReceiptUploadButton onParsed={(parsed) => setDraft((prev) => [prev, parsed.join(', ')].filter(Boolean).join(', '))} />
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      )}

      {isError && <ErrorBanner message={getErrorMessage(error)} />}

      {ingredients && ingredients.length === 0 && (
        <EmptyState message="아직 등록된 재료가 없어요. 재료를 추가하거나 영수증을 스캔해보세요." />
      )}

      {ingredients && ingredients.length > 0 && <IngredientList ingredients={ingredients} />}
    </div>
  )
}
