import { useSearchParams } from 'react-router-dom'

import { ErrorBanner } from '../components/common/ErrorBanner'
import { Spinner } from '../components/common/Spinner'
import { RecipeContent } from '../components/recipes/RecipeContent'
import { SaveToggleButton } from '../components/recipes/SaveToggleButton'
import { toSourceId } from '../api/endpoints/savedRecipes'
import { useRecipeDetailQuery } from '../hooks/useRecipeDetail'
import { getErrorMessage } from '../lib/errors'

export function RecipeDetailPage() {
  const [searchParams] = useSearchParams()
  const boardName = searchParams.get('board_name')
  const authorName = searchParams.get('author_name')

  const { data, isLoading, isError, error } = useRecipeDetailQuery(boardName, authorName)

  if (!boardName || !authorName) {
    return <ErrorBanner message="잘못된 접근입니다." />
  }

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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <SaveToggleButton sourceId={toSourceId(boardName, authorName)} />
      </div>
      <RecipeContent
        recipeName={data.recipe_name}
        mainImageUrl={data.main_image_url}
        difficulty={data.recipe_difficulty}
        time={data.time}
        ingredients={data.ingredients}
        steps={data.steps}
        tips={data.tips}
        sourceUrl={data.source_url}
      />
    </div>
  )
}
