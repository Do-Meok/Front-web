import { apiClient } from '../client'
import type { RecipeDetailResponse, RecipeRecommendationResponse } from '../../types/api'

export function getRecommendations() {
  return apiClient.get<RecipeRecommendationResponse>('/recipes/recommendations').then((r) => r.data)
}

export function getRecipeDetail(boardName: string, authorName: string) {
  return apiClient
    .get<RecipeDetailResponse>('/recipes/detail', { params: { board_name: boardName, author_name: authorName } })
    .then((r) => r.data)
}
