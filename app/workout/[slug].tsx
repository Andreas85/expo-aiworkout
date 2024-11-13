import React, { useEffect } from 'react';
import GradientBackground from '@/components/atoms/GradientBackground';
import WorkoutDetail from '@/components/screens/WorkoutDetail';
import { useLocalSearchParams } from 'expo-router';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';
import { getWorkoutDetailById } from '@/services/workouts';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import Loading from '@/components/atoms/Loading';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tailwind } from '@/utils/tailwind';
import { Platform } from 'react-native';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useFetchData } from '@/hooks/useFetchData';

const WorkoutDetailIndex = () => {
  const queryClient = useQueryClient();
  const { slug } = useLocalSearchParams();
  const { isLargeScreen } = useWebBreakPoints();
  const { setWorkoutDetail } = useWorkoutDetailStore();
  const workoutDetail = useWorkoutDetailStore(state => state.workoutDetail);

  // const cachedData: any = queryClient.getQueryData([REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug]);

  const { data, refetch, isLoading, isStale } = useFetchData({
    queryFn: async () => {
      const response = await getWorkoutDetailById({ id: slug });
      console.log({ response });
      setWorkoutDetail(response);
      return response;
    },
    staleTime: 0, // 1 minute
    enabled: false,
    queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug],
  });

  // Uncomment this block of code if you want to use the fresh data
  // useEffect(() => {
  //   if (slug) {
  //     refetch();
  //   }
  // }, [slug]);

  // useEffect(() => {
  //   if (data) {
  //     setWorkoutDetail(data); // Update store with the latest data
  //   }
  // }, [data]);

  // Uncomment this block of code if you want to use the cached data

  useEffect(() => {
    const cachedData: any = queryClient.getQueryData([
      REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS,
      slug,
    ]);
    const requiredData = data || cachedData;
    console.log('Refetch: ', { isStale }, { data });
    console.log({ requiredData });
    if (requiredData) {
      setWorkoutDetail(requiredData);
    } else {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug],
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
      return <WorkoutDetail />;
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

export default WorkoutDetailIndex;
