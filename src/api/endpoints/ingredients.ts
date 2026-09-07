import { apiClient } from '../client'
import type { Ingredient } from '../../types/api'

export function getIngredients() {
  return apiClient.get<Ingredient[]>('/ingredients').then((r) => r.data)
}

export function addIngredients(ingredients: string[]) {
  return apiClient.post<Ingredient[]>('/ingredients', { ingredients }).then((r) => r.data)
}

export function deleteIngredient(id: number) {
  return apiClient.delete(`/ingredients/${id}`)
}

export function deleteIngredients(ids: number[]) {
  return apiClient.delete('/ingredients', { data: { ingredient_ids: ids } })
}

// 백엔드 라우터가 전체 삭제를 GET으로 정의해 두었다 (버그성 quirk). DELETE로 호출하면 404가 난다.
export function deleteAllIngredients() {
  return apiClient.get('/ingredients/all-delete')
}
