const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize'

// 카카오 로그인 리다이렉트는 풀 페이지 이동이라 React Router state가 유지되지 않으므로,
// 로그인 후 돌아갈 경로를 sessionStorage에 잠깐 보관해둔다.
export const KAKAO_LOGIN_FROM_KEY = 'domeok.kakao_login_from'

export function getKakaoRedirectUri(): string {
  return import.meta.env.VITE_KAKAO_REDIRECT_URI
}

// Authorization Code 방식: 카카오 로그인 페이지로 리다이렉트한다.
// 사용자가 승인하면 redirect_uri로 ?code=... 가 붙어 돌아온다.
export function redirectToKakaoLogin(): void {
  const clientId = import.meta.env.VITE_KAKAO_REST_API_KEY
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getKakaoRedirectUri(),
    response_type: 'code',
  })
  window.location.href = `${KAKAO_AUTHORIZE_URL}?${params.toString()}`
}
