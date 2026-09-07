import { useNavigate } from 'react-router-dom'

import type { SavedRecipeListItem } from '../../types/api'
import { isMeaningfulText } from '../../lib/format'

interface SavedRecipeCardProps {
  recipe: SavedRecipeListItem
  selectMode?: boolean
  selected?: boolean
  onToggleSelect?: (id: string) => void
}

export function SavedRecipeCard({ recipe, selectMode = false, selected = false, onToggleSelect }: SavedRecipeCardProps) {
  const navigate = useNavigate()

  function handleClick() {
    if (selectMode) {
      onToggleSelect?.(recipe.id)
      return
    }
    navigate(`/saved/${recipe.id}`)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex flex-col gap-2 rounded-xl border bg-white p-4 text-left transition-shadow hover:shadow-md ${
        selectMode && selected ? 'border-orange-400 ring-1 ring-orange-400' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{recipe.recipe_name}</h3>
        {selectMode && (
          <input
            type="checkbox"
            checked={selected}
            readOnly
            className="mt-1 h-4 w-4 accent-orange-500"
            aria-label={`${recipe.recipe_name} 선택`}
          />
        )}
      </div>
      <div className="flex gap-2 text-xs text-gray-500">
        {isMeaningfulText(recipe.recipe_difficulty) && <span>{recipe.recipe_difficulty}</span>}
        {isMeaningfulText(recipe.time) && <span>{recipe.time}</span>}
      </div>
      <p className="text-xs text-gray-400">{new Date(recipe.created_at).toLocaleDateString('ko-KR')}</p>
    </button>
  )
}
