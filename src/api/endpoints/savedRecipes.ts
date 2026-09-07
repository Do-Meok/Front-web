import { apiClient } from '../client'
import type {
  SavedRecipeDetailResponse,
  SavedRecipeListItem,
  SavedRecipeOwnedIngredient,
  SavedRecipeStatusResponse,
} from '../../types/api'

export function toSourceId(boardName: string, authorName: string): string {
  return `${boardName}|${authorName}`
}

export function listSavedRecipes() {
  return apiClient.get<SavedRecipeListItem[]>('/recipes/saved').then((r) => r.data)
}

export function getSavedRecipe(id: string) {
  return apiClient.get<SavedRecipeDetailResponse>(`/recipes/saved/${id}`).then((r) => r.data)
}

export function getSavedStatus(sourceId: string) {
  return apiClient
    .get<SavedRecipeStatusResponse>('/recipes/saved/status', { params: { source: 'mangae', source_id: sourceId } })
    .then((r) => r.data)
}

export function saveRecipe(sourceId: string) {
  return apiClient
    .post<SavedRecipeDetailResponse>('/recipes/saved', { source: 'mangae', source_id: sourceId })
    .then((r) => r.data)
}

export function deleteSavedRecipe(id: string) {
  return apiClient.delete(`/recipes/saved/${id}`)
}

export function getSavedRecipeOwnedIngredients(id: string) {
  return apiClient
    .get<SavedRecipeOwnedIngredient[]>(`/recipes/saved/${id}/owned-ingredients`)
    .then((r) => r.data)
}
