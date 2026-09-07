import { useMemo, useState } from 'react'

import { Button } from '../common/Button'
import { Spinner } from '../common/Spinner'
import { useDeleteOwnedIngredientsMutation, useSavedRecipeOwnedIngredientsQuery } from '../../hooks/useSavedRecipes'
import { getErrorMessage } from '../../lib/errors'

// recipeId가 바뀔 때 체크 상태를 초기화하려면 부모에서 key={recipeId}로 이 컴포넌트를 리마운트해야 한다.
export function UsedIngredientsChecklist({ recipeId }: { recipeId: string }) {
  const { data: ownedIngredients, isLoading, isError } = useSavedRecipeOwnedIngredientsQuery(recipeId)
  const deleteMutation = useDeleteOwnedIngredientsMutation(recipeId)
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set())

  const allChecked = useMemo(
    () => Boolean(ownedIngredients?.length) && checkedIds.size === ownedIngredients?.length,
    [checkedIds, ownedIngredients],
  )

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner size={20} />
      </div>
    )
  }

  // 매칭되는 보유 식재료가 없거나 조회에 실패하면 부가 기능이므로 조용히 섹션을 숨긴다.
  if (isError || !ownedIngredients || ownedIngredients.length === 0) {
    return null
  }

  function toggleOne(id: number) {
    setCheckedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function toggleAll() {
    if (allChecked) {
      setCheckedIds(new Set())
    } else {
      setCheckedIds(new Set(ownedIngredients!.map((item) => item.id)))
    }
  }

  function handleDelete() {
    if (checkedIds.size === 0) return
    deleteMutation.mutate(Array.from(checkedIds), {
      onSuccess: () => setCheckedIds(new Set()),
    })
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">이 레시피에 쓴 보유 식재료</h2>
        <button type="button" onClick={toggleAll} className="text-xs font-medium text-orange-500 hover:underline">
          {allChecked ? '전체 해제' : '전체 선택'}
        </button>
      </div>

      <ul className="flex flex-col gap-2">
        {ownedIngredients.map((ingredient) => (
          <li key={ingredient.id} className="flex items-center gap-2">
            <input
              id={`used-ingredient-${ingredient.id}`}
              type="checkbox"
              checked={checkedIds.has(ingredient.id)}
              onChange={() => toggleOne(ingredient.id)}
              className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <label htmlFor={`used-ingredient-${ingredient.id}`} className="text-sm text-gray-700">
              {ingredient.ingredient_name}
            </label>
          </li>
        ))}
      </ul>

      {deleteMutation.isError && (
        <p className="mt-2 text-xs text-red-500">
          {getErrorMessage(deleteMutation.error, '식재료 삭제 중 오류가 발생했습니다.')}
        </p>
      )}

      <div className="mt-3 flex justify-end">
        <Button
          variant="secondary"
          onClick={handleDelete}
          disabled={checkedIds.size === 0 || deleteMutation.isPending}
        >
          선택한 재료 보유 목록에서 삭제
        </Button>
      </div>
    </section>
  )
}
