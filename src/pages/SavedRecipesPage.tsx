import { EmptyState } from '../components/common/EmptyState'
import { ErrorBanner } from '../components/common/ErrorBanner'
import { Spinner } from '../components/common/Spinner'
import { SavedRecipeCard } from '../components/recipes/SavedRecipeCard'
import { useSavedRecipesQuery } from '../hooks/useSavedRecipes'
import { getErrorMessage } from '../lib/errors'

export function SavedRecipesPage() {
  const { data, isLoading, isError, error } = useSavedRecipesQuery()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-bold text-gray-900">저장한 레시피</h1>

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
            <SavedRecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}
