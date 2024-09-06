import { QueryFunctionContext, useQuery } from '@tanstack/react-query';

interface IUseFetchData {
  queryKey: unknown[];
  queryFn: (context: QueryFunctionContext) => Promise<any>;
  staleTime?: number;
}

export const useFetchData = (props: IUseFetchData) => {
  const { queryKey, staleTime = 0, queryFn } = props;
  const { data, isLoading, isError, error, isPending, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,
    staleTime: staleTime, // Eg: 60 * 1000 = 1 minute,
  });

  return { data, isLoading, isError, error, isPending, refetch };
};
