import { useDeleteSavedRecipeMutation, useSavedStatusQuery, useSaveRecipeMutation } from '../../hooks/useSavedRecipes'
import { getErrorMessage } from '../../lib/errors'

export function SaveToggleButton({ sourceId }: { sourceId: string }) {
  const statusQuery = useSavedStatusQuery(sourceId)
  const saveMutation = useSaveRecipeMutation(sourceId)
  const deleteMutation = useDeleteSavedRecipeMutation(sourceId)

  const isBusy = statusQuery.isLoading || saveMutation.isPending || deleteMutation.isPending
  const isSaved = statusQuery.data?.saved ?? false
  const error = saveMutation.error ?? deleteMutation.error

  function handleClick() {
    if (isBusy) return
    if (isSaved && statusQuery.data?.id) {
      deleteMutation.mutate(statusQuery.data.id)
    } else {
      saveMutation.mutate()
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isBusy}
        aria-label={isSaved ? '저장 취소' : '레시피 저장'}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-xl transition-colors hover:bg-gray-50 disabled:opacity-50"
      >
        {isSaved ? '❤️' : '🤍'}
      </button>
      {error && <p className="text-xs text-red-500">{getErrorMessage(error, '처리에 실패했습니다.')}</p>}
    </div>
  )
}
