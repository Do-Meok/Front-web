import type { RecipeIngredient, RecipeStep } from '../../types/api'
import { isMeaningfulText } from '../../lib/format'

export interface RecipeContentProps {
  recipeName: string
  mainImageUrl?: string | null
  difficulty?: string | null
  time?: string | null
  ingredients: RecipeIngredient[]
  steps: RecipeStep[]
  tips?: string[]
  sourceUrl?: string | null
}

export function RecipeContent({
  recipeName,
  mainImageUrl,
  difficulty,
  time,
  ingredients,
  steps,
  tips,
  sourceUrl,
}: RecipeContentProps) {
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order)

  return (
    <div className="flex flex-col gap-6">
      {mainImageUrl && (
        <img src={mainImageUrl} alt={recipeName} className="h-64 w-full rounded-xl object-cover" />
      )}

      <div>
        <h1 className="text-xl font-bold text-gray-900">{recipeName}</h1>
        <div className="mt-2 flex gap-2">
          {isMeaningfulText(difficulty) && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">{difficulty}</span>
          )}
          {isMeaningfulText(time) && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">{time}</span>
          )}
        </div>
      </div>

      {ingredients.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-gray-900">재료</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700">
            {ingredients.map((ingredient, index) => (
              <li key={`${ingredient.name}-${index}`} className="flex justify-between border-b border-gray-100 py-1">
                <span>{ingredient.name}</span>
                {ingredient.amount && <span className="text-gray-400">{ingredient.amount}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {sortedSteps.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-gray-900">조리 순서</h2>
          <ol className="flex flex-col gap-3">
            {sortedSteps.map((step) => (
              <li key={step.order} className="flex gap-3 text-sm text-gray-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-600">
                  {step.order}
                </span>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {tips && tips.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-gray-900">팁</h2>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </section>
      )}

      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-orange-500 hover:underline"
        >
          원문 보기 →
        </a>
      )}
    </div>
  )
}
