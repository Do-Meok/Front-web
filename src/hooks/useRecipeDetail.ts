import { useQuery } from '@tanstack/react-query'

import { getRecipeDetail } from '../api/endpoints/recommendations'

export function useRecipeDetailQuery(boardName: string | null, authorName: string | null) {
  return useQuery({
    queryKey: ['recipeDetail', boardName, authorName],
    queryFn: () => getRecipeDetail(boardName!, authorName!),
    enabled: Boolean(boardName && authorName),
  })
}
