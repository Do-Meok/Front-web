import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '../components/common/Button'
import { ErrorBanner } from '../components/common/ErrorBanner'
import { Spinner } from '../components/common/Spinner'
import { RecipeContent, type RecipeContentProps } from '../components/recipes/RecipeContent'
import { useDeleteSavedRecipeMutation, useSavedRecipeDetailQuery } from '../hooks/useSavedRecipes'
import { getErrorMessage } from '../lib/errors'
import type { RecipeIngredient, RecipeStep } from '../types/api'

function normalizeSnapshot(snapshot: Record<string, unknown>, fallbackName: string): RecipeContentProps {
  const ingredients = Array.isArray(snapshot.ingredients) ? (snapshot.ingredients as RecipeIngredient[]) : []
  const steps = Array.isArray(snapshot.steps) ? (snapshot.steps as RecipeStep[]) : []
  const tips = Array.isArray(snapshot.tips) ? (snapshot.tips as string[]) : []

  return {
    recipeName: typeof snapshot.recipe_name === 'string' ? snapshot.recipe_name : fallbackName,
    mainImageUrl: typeof snapshot.main_image_url === 'string' ? snapshot.main_image_url : null,
    difficulty: typeof snapshot.recipe_difficulty === 'string' ? snapshot.recipe_difficulty : null,
    time: typeof snapshot.time === 'string' ? snapshot.time : null,
    ingredients,
    steps,
    tips,
    sourceUrl: typeof snapshot.source_url === 'string' ? snapshot.source_url : null,
  }
}

export function SavedRecipeDetailPage() {
  const { recipeId } = useParams<{ recipeId: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isError, error } = useSavedRecipeDetailQuery(recipeId)
  const deleteMutation = useDeleteSavedRecipeMutation()

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (isError || !data) {
    return <ErrorBanner message={getErrorMessage(error, '레시피를 불러오지 못했습니다.')} />
  }

  function handleDelete() {
    if (!recipeId) return
    if (window.confirm('저장한 레시피를 삭제할까요?')) {
      deleteMutation.mutate(recipeId, { onSuccess: () => navigate('/saved') })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button variant="danger" onClick={handleDelete} disabled={deleteMutation.isPending}>
          삭제
        </Button>
      </div>
      <RecipeContent {...normalizeSnapshot(data.snapshot, data.recipe_name)} />
    </div>
  )
}
