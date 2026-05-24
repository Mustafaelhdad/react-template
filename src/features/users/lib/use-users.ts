import { useQuery, useQueryClient } from '@tanstack/react-query'

import type { User } from '@/entities'
import { useApiMutation } from '@/shared/lib'

import {
  fetchUser,
  fetchUsers,
  updateUser,
  type UpdateUserPayload,
} from '../api/users-api'
import { userKeys } from '../model/user-keys'

export function useUsers() {
  return useQuery<User[]>({
    queryKey: userKeys.list(),
    queryFn: fetchUsers,
  })
}

export function useUser(id: string) {
  return useQuery<User>({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUser(id),
    enabled: Boolean(id),
  })
}

type UpdateUserVariables = {
  id: string
  payload: UpdateUserPayload
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useApiMutation<User, UpdateUserVariables>({
    mutationFn: ({ id, payload }) => updateUser(id, payload),
    successMessage: 'User updated',
    onSuccess: (data) => {
      queryClient.setQueryData(userKeys.detail(data.id), data)
      void queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}
