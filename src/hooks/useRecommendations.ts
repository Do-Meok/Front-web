import { useMutation } from '@tanstack/react-query'

import { getRecommendations } from '../api/endpoints/recommendations'

// 하루 5회로 제한된 쿼터를 소모하는 액션이라 useQuery(자동 refetch)가 아니라
// 사용자가 명시적으로 누를 때만 호출되는 useMutation으로 구현한다.
export function useRecommendationsMutation() {
  return useMutation({ mutationFn: getRecommendations })
}
