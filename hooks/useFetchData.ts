import { QueryFunctionContext, useQuery } from '@tanstack/react-query';

interface IUseFetchData {
  queryKey: unknown[];
  queryFn: (context: QueryFunctionContext) => Promise<any>;
  staleTime?: number;
  enabled?: boolean;
  keepPreviousData?: any;
}

export const useFetchData = (props: IUseFetchData) => {
  const { queryKey, staleTime = 0, queryFn, enabled = true } = props;
  const { data, isLoading, isError, error, isPending, refetch, fetchStatus, isStale, isSuccess } =
    useQuery({
      queryKey: queryKey,
      queryFn: queryFn,
      staleTime: staleTime, // Eg: 60 * 1000 = 1 minute,
      enabled: enabled,
    });

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
  };
};
