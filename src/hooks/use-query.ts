import {
  UndefinedInitialDataOptions,
  useQuery as useRQ,
} from '@tanstack/react-query'

type Options<D> = UndefinedInitialDataOptions<unknown, Error, D, string[]>

export function useQuery<D>(
  key: Options<D>['queryKey'],
  fn: Options<D>['queryFn'],
  others?: Omit<Options<D>, 'queryKey' | 'queryFn'> | undefined,
) {
  const { data, isLoading, ...more } = useRQ({
    queryKey: key,
    queryFn: fn,
    ...others,
  })

  return { data, isLoading, ...more }
}
