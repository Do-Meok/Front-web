import { Navigate, Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from '../auth/ProtectedRoute'
import { AppLayout } from '../components/layout/AppLayout'
import { IngredientsPage } from '../pages/IngredientsPage'
import { KakaoCallbackPage } from '../pages/KakaoCallbackPage'
import { KakaoCompleteProfilePage } from '../pages/KakaoCompleteProfilePage'
import { LoginPage } from '../pages/LoginPage'
import { MyPage } from '../pages/MyPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { PasswordResetConfirmPage } from '../pages/PasswordResetConfirmPage'
import { PasswordResetRequestPage } from '../pages/PasswordResetRequestPage'
import { RecipeDetailPage } from '../pages/RecipeDetailPage'
import { RecommendationsPage } from '../pages/RecommendationsPage'
import { SavedRecipeDetailPage } from '../pages/SavedRecipeDetailPage'
import { SavedRecipesPage } from '../pages/SavedRecipesPage'
import { SignupRequestPage } from '../pages/SignupRequestPage'
import { SignupVerifyPage } from '../pages/SignupVerifyPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupRequestPage />} />
      <Route path="/signup/verify" element={<SignupVerifyPage />} />
      <Route path="/password-reset" element={<PasswordResetRequestPage />} />
      <Route path="/password-reset/confirm" element={<PasswordResetConfirmPage />} />
      <Route path="/kakao/complete-profile" element={<KakaoCompleteProfilePage />} />
      <Route path="/auth/kakao/callback" element={<KakaoCallbackPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/ingredients" replace />} />
        <Route path="/ingredients" element={<IngredientsPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/recipes/detail" element={<RecipeDetailPage />} />
        <Route path="/saved" element={<SavedRecipesPage />} />
        <Route path="/saved/:recipeId" element={<SavedRecipeDetailPage />} />
        <Route path="/mypage" element={<MyPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
