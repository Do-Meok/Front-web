import { useNavigate } from 'react-router-dom'

import type { SavedRecipeListItem } from '../../types/api'
import { isMeaningfulText } from '../../lib/format'

export function SavedRecipeCard({ recipe }: { recipe: SavedRecipeListItem }) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate(`/saved/${recipe.id}`)}
      className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 text-left transition-shadow hover:shadow-md"
    >
      <h3 className="font-semibold text-gray-900">{recipe.recipe_name}</h3>
      <div className="flex gap-2 text-xs text-gray-500">
        {isMeaningfulText(recipe.recipe_difficulty) && <span>{recipe.recipe_difficulty}</span>}
        {isMeaningfulText(recipe.time) && <span>{recipe.time}</span>}
      </div>
      <p className="text-xs text-gray-400">{new Date(recipe.created_at).toLocaleDateString('ko-KR')}</p>
    </button>
  )
}
