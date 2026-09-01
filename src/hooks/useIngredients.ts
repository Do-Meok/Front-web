import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { addIngredients, deleteAllIngredients, deleteIngredient, getIngredients } from '../api/endpoints/ingredients'

const INGREDIENTS_KEY = ['ingredients']

export function useIngredientsQuery() {
  return useQuery({ queryKey: INGREDIENTS_KEY, queryFn: getIngredients })
}

export function useAddIngredientsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addIngredients,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INGREDIENTS_KEY }),
  })
}

export function useDeleteIngredientMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteIngredient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INGREDIENTS_KEY }),
  })
}

export function useDeleteAllIngredientsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAllIngredients,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INGREDIENTS_KEY }),
  })
}
