import { useState } from 'react'

import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorBanner } from '../components/common/ErrorBanner'
import { Spinner } from '../components/common/Spinner'
import { SavedRecipeCard } from '../components/recipes/SavedRecipeCard'
import { useDeleteSavedRecipesMutation, useSavedRecipesQuery } from '../hooks/useSavedRecipes'
import { getErrorMessage } from '../lib/errors'

export function SavedRecipesPage() {
  const { data, isLoading, isError, error } = useSavedRecipesQuery()
  const deleteMutation = useDeleteSavedRecipesMutation()
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  function toggleSelectMode() {
    setSelectMode((prev) => !prev)
    setSelectedIds(new Set())
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function toggleSelectAll() {
    if (!data) return
    setSelectedIds((prev) => (prev.size === data.length ? new Set() : new Set(data.map((r) => r.id))))
  }

  function handleDeleteSelected() {
    if (selectedIds.size === 0) return
    if (window.confirm(`선택한 레시피 ${selectedIds.size}개를 삭제할까요?`)) {
      deleteMutation.mutate(Array.from(selectedIds), {
        onSuccess: () => {
          setSelectedIds(new Set())
          setSelectMode(false)
        },
      })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">저장한 레시피</h1>
        {data && data.length > 0 && (
          <div className="flex items-center gap-2">
            {selectMode && (
              <>
                <Button variant="secondary" onClick={toggleSelectAll}>
                  {selectedIds.size === data.length ? '전체 해제' : '전체 선택'}
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteSelected}
                  disabled={selectedIds.size === 0 || deleteMutation.isPending}
                >
                  삭제{selectedIds.size > 0 ? ` (${selectedIds.size})` : ''}
                </Button>
              </>
            )}
            <Button variant="secondary" onClick={toggleSelectMode}>
              {selectMode ? '취소' : '선택 삭제'}
            </Button>
          </div>
        )}
      </div>

      <ErrorBanner message={deleteMutation.isError ? getErrorMessage(deleteMutation.error) : null} />

      {isLoading && (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      )}

      {isError && <ErrorBanner message={getErrorMessage(error)} />}

      {data && data.length === 0 && <EmptyState message="아직 저장한 레시피가 없어요." />}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.map((recipe) => (
            <SavedRecipeCard
              key={recipe.id}
              recipe={recipe}
              selectMode={selectMode}
              selected={selectedIds.has(recipe.id)}
              onToggleSelect={toggleSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}
