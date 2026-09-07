import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  deleteSavedRecipe,
  getSavedRecipe,
  getSavedRecipeOwnedIngredients,
  getSavedStatus,
  listSavedRecipes,
  saveRecipe,
} from '../api/endpoints/savedRecipes'
import { deleteIngredients } from '../api/endpoints/ingredients'
import { INGREDIENTS_KEY } from './useIngredients'

const SAVED_LIST_KEY = ['savedRecipes']

function ownedIngredientsKey(recipeId: string) {
  return ['savedRecipeOwnedIngredients', recipeId]
}

export function useSavedRecipesQuery() {
  return useQuery({ queryKey: SAVED_LIST_KEY, queryFn: listSavedRecipes })
}

export function useSavedRecipeDetailQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['savedRecipe', id],
    queryFn: () => getSavedRecipe(id!),
    enabled: Boolean(id),
  })
}

export function useSavedStatusQuery(sourceId: string) {
  return useQuery({
    queryKey: ['savedStatus', sourceId],
    queryFn: () => getSavedStatus(sourceId),
  })
}

export function useSaveRecipeMutation(sourceId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => saveRecipe(sourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedStatus', sourceId] })
      queryClient.invalidateQueries({ queryKey: SAVED_LIST_KEY })
    },
  })
}

export function useDeleteSavedRecipeMutation(sourceId?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSavedRecipe,
    onSuccess: () => {
      if (sourceId) {
        queryClient.invalidateQueries({ queryKey: ['savedStatus', sourceId] })
      }
      queryClient.invalidateQueries({ queryKey: SAVED_LIST_KEY })
    },
  })
}

export function useDeleteSavedRecipesMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => Promise.all(ids.map((id) => deleteSavedRecipe(id))),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SAVED_LIST_KEY }),
  })
}

export function useSavedRecipeOwnedIngredientsQuery(recipeId: string | undefined) {
  return useQuery({
    queryKey: ownedIngredientsKey(recipeId ?? ''),
    queryFn: () => getSavedRecipeOwnedIngredients(recipeId!),
    enabled: Boolean(recipeId),
  })
}

// 저장 레시피 상세에서 "다 썼어요" 체크 후 선택 삭제 — 보유 식재료 목록과
// 해당 레시피의 매칭 목록을 함께 갱신해야 체크박스가 최신 상태로 사라진다.
export function useDeleteOwnedIngredientsMutation(recipeId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ingredientIds: number[]) => deleteIngredients(ingredientIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INGREDIENTS_KEY })
      if (recipeId) {
        queryClient.invalidateQueries({ queryKey: ownedIngredientsKey(recipeId) })
      }
    },
  })
}
