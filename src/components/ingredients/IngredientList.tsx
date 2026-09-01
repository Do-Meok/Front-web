import type { Ingredient } from '../../types/api'
import { useDeleteIngredientMutation } from '../../hooks/useIngredients'

export function IngredientList({ ingredients }: { ingredients: Ingredient[] }) {
  const deleteMutation = useDeleteIngredientMutation()

  return (
    <ul className="flex flex-col gap-2">
      {ingredients.map((ingredient) => (
        <li
          key={ingredient.id}
          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2"
        >
          <div>
            <span className="text-sm font-medium text-gray-800">{ingredient.ingredient_name}</span>
            <span className="ml-2 text-xs text-gray-400">{ingredient.created_at}</span>
          </div>
          <button
            type="button"
            onClick={() => deleteMutation.mutate(ingredient.id)}
            disabled={deleteMutation.isPending}
            aria-label={`${ingredient.ingredient_name} 삭제`}
            className="text-xs text-gray-400 hover:text-red-500 disabled:opacity-50"
          >
            삭제
          </button>
        </li>
      ))}
    </ul>
  )
}
