import {
  type DefaultError,
  type MutationFunction,
  useMutation as useRQMutation,
} from '@tanstack/react-query'

export function useMutation<D, V>(
  mutationKey: string[],
  mutationFn: MutationFunction<D, V>,
  onSuccess?: () => void,
) {
  const { mutate, data, error, isPending } = useRQMutation<D, DefaultError, V>({
    mutationKey,
    mutationFn,
    onSuccess,
  })

  return { mutate, data, error, isPending } as const
}
