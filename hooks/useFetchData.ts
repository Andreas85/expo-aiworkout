import { QueryFunctionContext, useQuery } from '@tanstack/react-query';

interface IUseFetchData {
  queryKey: unknown[];
  queryFn: (context: QueryFunctionContext) => Promise<any>;
  staleTime?: number;
  enabled?: boolean;
  keepPreviousData?: any;
  shouldFetchFresh?: boolean;
}

export const useFetchData = (props: IUseFetchData) => {
  const { queryKey, staleTime = 0, queryFn, enabled = true, shouldFetchFresh } = props;
  const { data, isLoading, isError, error, isPending, refetch, fetchStatus, isStale, isSuccess } =
    useQuery({
      queryKey: queryKey,
      queryFn: queryFn,
      staleTime: staleTime, // Eg: 60 * 1000 = 1 minute,
      enabled: enabled,
    });

  // Conditionally refetch if shouldFetchFresh is true and the data is stale
  if (shouldFetchFresh && isStale && !isLoading) {
    refetch(); // Trigger refetch for fresh data
  }

  return {
    data,
    isLoading,
    isError,
    error,
    isPending,
    refetch,
    enabled,
    fetchStatus,
    isStale,
    isSuccess,
    shouldFetchFresh,
  };
};
