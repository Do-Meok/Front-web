export interface ValidationErrorItem {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface ApiError {
  status_code: number
  code: string
  detail: string | ValidationErrorItem[]
  errors: unknown[] | null
}

export interface UserInfo {
  email: string
  nickname: string
  name: string
  birth: string
}

export interface LogInResponse {
  info: UserInfo
  access_token: string
  refresh_token: string
}

export interface KakaoAuthResponse {
  status: 'authenticated'
  info: UserInfo
  access_token: string
  refresh_token: string
}

export interface KakaoNeedsProfileResponse {
  status: 'needs_profile'
  signup_token: string
}

export type KakaoLoginResult = KakaoAuthResponse | KakaoNeedsProfileResponse

export interface SignupAcceptedResponse {
  email: string
  message: string
  expires_in_seconds: number
  quota_remaining: number
}

export interface PasswordResetAcceptedResponse {
  message: string
  quota_remaining: number
}

export interface Ingredient {
  id: number
  ingredient_name: string
  created_at: string
}

export interface RecipeRecommendation {
  recipe_name: string
  owned_ingredients: string[]
  missing_ingredients: string[]
  board_name: string
  author_name: string
  recipe_difficulty: string
  time: string
  score: number
}

export interface RecipeRecommendationResponse {
  ingredients_used: string[]
  recipes: RecipeRecommendation[]
  quota_remaining: number
}

export interface RecipeIngredient {
  name: string
  amount: string
}

export interface RecipeStep {
  order: number
  description: string
}

export interface RecipeDetailResponse {
  board_name: string
  author_name: string
  recipe_name: string
  source_url: string
  main_image_url: string | null
  recipe_difficulty: string | null
  time: string | null
  ingredients: RecipeIngredient[]
  steps: RecipeStep[]
  tips: string[]
  cached: boolean
}

export interface SavedRecipeListItem {
  id: string
  source: string
  source_id: string
  recipe_name: string
  recipe_difficulty: string | null
  time: string | null
  created_at: string
}

export interface SavedRecipeDetailResponse extends SavedRecipeListItem {
  snapshot: Record<string, unknown>
}

export interface SavedRecipeStatusResponse {
  saved: boolean
  id: string | null
}
