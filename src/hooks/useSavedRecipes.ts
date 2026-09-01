import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  deleteSavedRecipe,
  getSavedRecipe,
  getSavedStatus,
  listSavedRecipes,
  saveRecipe,
} from '../api/endpoints/savedRecipes'

const SAVED_LIST_KEY = ['savedRecipes']

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
