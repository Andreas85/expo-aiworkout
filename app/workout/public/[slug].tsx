import React, { useEffect } from 'react';
import GradientBackground from '@/components/atoms/GradientBackground';
import { useLocalSearchParams } from 'expo-router';
import Loading from '@/components/atoms/Loading';
import { fetchPublicWorkoutServiceById } from '@/services/workouts';
import { REACT_QUERY_API_KEYS, REACT_QUERY_STALE_TIME } from '@/utils/appConstants';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tailwind } from '@/utils/tailwind';
import PublicWorkoutDetail from '@/components/screens/PublicWorkoutDetail';
import { Platform } from 'react-native';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const PublicWorkoutDetailIndex = () => {
  const { slug } = useLocalSearchParams();
  const { isLargeScreen } = useWebBreakPoints();
  const queryClient = useQueryClient();

  const { setWorkoutDetail } = useWorkoutDetailStore();
  const workoutDetail = useWorkoutDetailStore(state => state.workoutDetail);

  const cachedData: any = queryClient.getQueryData([
    REACT_QUERY_API_KEYS.PUBLIC_WORKOUT_DETAILS,
    slug,
  ]);

  const { data, isLoading, refetch } = useQuery({
    queryFn: () => fetchPublicWorkoutServiceById({ id: slug }),
    queryKey: [REACT_QUERY_API_KEYS.PUBLIC_WORKOUT_DETAILS, slug],
    staleTime: REACT_QUERY_STALE_TIME.PUBLIC_WORKOUT_DETAILS,
    enabled: false,
  });

  useEffect(() => {
    const cachedData: any = queryClient.getQueryData([
      REACT_QUERY_API_KEYS.PUBLIC_WORKOUT_DETAILS,
      slug,
    ]);
    const requiredData = data || cachedData;
    // console.log('Refetch: ', { isStale }, { data });
    // console.log({ requiredData });
    if (requiredData) {
      setWorkoutDetail(requiredData);
    } else {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_API_KEYS.PUBLIC_WORKOUT_DETAILS, slug],
        refetchType: 'all',
      });
      refetch();
    }
  }, [slug, refetch, data]);

  const renderWorkingDetails = () => {
    if (isLoading) {
      return <Loading />;
    }
    if (workoutDetail) {
      return <PublicWorkoutDetail />;
    }
  };
  return (
    <SafeAreaView
      style={[
        Platform.select({
          web: tailwind(`${!isLargeScreen ? 'mt-24' : ''} flex-1`),
          native: tailwind('flex-1'),
        }),
      ]}>
      <GradientBackground>{renderWorkingDetails()}</GradientBackground>
    </SafeAreaView>
  );
};

export default PublicWorkoutDetailIndex;
