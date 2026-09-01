import { useNavigate } from 'react-router-dom'

import type { RecipeRecommendation } from '../../types/api'
import { isMeaningfulText } from '../../lib/format'

export function RecipeCard({ recipe }: { recipe: RecipeRecommendation }) {
  const navigate = useNavigate()

  function handleClick() {
    const params = new URLSearchParams({ board_name: recipe.board_name, author_name: recipe.author_name })
    navigate(`/recipes/detail?${params.toString()}`)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 text-left transition-shadow hover:shadow-md"
    >
      <h3 className="font-semibold text-gray-900">{recipe.recipe_name}</h3>
      <div className="flex gap-2 text-xs text-gray-500">
        {isMeaningfulText(recipe.recipe_difficulty) && <span>{recipe.recipe_difficulty}</span>}
        {isMeaningfulText(recipe.time) && <span>{recipe.time}</span>}
      </div>
      {recipe.owned_ingredients.length > 0 && (
        <p className="text-xs text-green-600">보유: {recipe.owned_ingredients.join(', ')}</p>
      )}
      {recipe.missing_ingredients.length > 0 && (
        <p className="text-xs text-gray-400">부족: {recipe.missing_ingredients.join(', ')}</p>
      )}
    </button>
  )
}
