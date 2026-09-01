import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getMe, updateNickname, updatePassword } from '../api/endpoints/users'

const ME_KEY = ['me']

export function useMeQuery() {
  return useQuery({ queryKey: ME_KEY, queryFn: getMe })
}

export function useUpdateNicknameMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateNickname,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ME_KEY }),
  })
}

export function useUpdatePasswordMutation() {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
      checkedNewPassword,
    }: {
      currentPassword: string
      newPassword: string
      checkedNewPassword: string
    }) => updatePassword(currentPassword, newPassword, checkedNewPassword),
  })
}
