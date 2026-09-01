import { useState } from 'react'

import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorBanner } from '../components/common/ErrorBanner'
import { QuotaBadge } from '../components/common/QuotaBadge'
import { RecipeCard } from '../components/recipes/RecipeCard'
import { useRecommendationsMutation } from '../hooks/useRecommendations'
import { getErrorCode, getErrorMessage } from '../lib/errors'

const DAILY_LIMIT = 5

export function RecommendationsPage() {
  const mutation = useRecommendationsMutation()
  const [quotaRemaining, setQuotaRemaining] = useState<number | null>(null)

  function handleRecommend() {
    mutation.mutate(undefined, {
      onSuccess: (data) => setQuotaRemaining(data.quota_remaining),
      onError: (error) => {
        if (getErrorCode(error) === 'RATE_LIMIT_EXCEEDED') {
          setQuotaRemaining(0)
        }
      },
    })
  }

  const isExhausted = quotaRemaining === 0
  const errorMessage = mutation.isError && getErrorCode(mutation.error) !== 'RATE_LIMIT_EXCEEDED' ? getErrorMessage(mutation.error) : null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">레시피 추천</h1>
        {quotaRemaining !== null && <QuotaBadge label="오늘 남은 추천 횟수" remaining={quotaRemaining} total={DAILY_LIMIT} />}
      </div>

      <Button onClick={handleRecommend} disabled={mutation.isPending || isExhausted} className="self-start">
        {mutation.isPending ? '추천받는 중...' : '추천받기'}
      </Button>

      {isExhausted && <ErrorBanner message="오늘 추천 횟수를 모두 사용했습니다. 내일 다시 시도해주세요." />}
      {errorMessage && <ErrorBanner message={errorMessage} />}

      {!mutation.data && !mutation.isPending && !isExhausted && (
        <EmptyState message="보유한 재료로 레시피를 추천받아보세요." />
      )}

      {mutation.data && (
        <div className="flex flex-col gap-4">
          {mutation.data.ingredients_used.length > 0 && (
            <p className="text-xs text-gray-500">
              이 재료로 추천했어요: {mutation.data.ingredients_used.join(', ')}
            </p>
          )}
          {mutation.data.recipes.length === 0 ? (
            <EmptyState message="추천할 만한 레시피를 찾지 못했어요. 재료를 더 추가해보세요." />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {mutation.data.recipes.map((recipe, index) => (
                <RecipeCard key={`${recipe.board_name}-${recipe.author_name}-${index}`} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
