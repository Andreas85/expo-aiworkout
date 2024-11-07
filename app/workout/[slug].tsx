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
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useFetchData } from '@/hooks/useFetchData';
import { queryClient } from '@/utils/helper';

const WorkoutDetailIndex = () => {
  const { slug } = useLocalSearchParams();
  const { isLargeScreen } = useWebBreakPoints();
  const { setWorkoutDetail } = useWorkoutDetailStore();

  const { data, refetch, isLoading } = useFetchData({
    queryFn: () => getWorkoutDetailById({ id: slug }),
    queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug],
    keepPreviousData: keepPreviousData,
    enabled: false,
  });

  const data1: any =
    queryClient.getQueryData([REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug]) ?? {};
  // console.log({ data1 });

  // const { data, refetch, isLoading } = useQuery({
  //   queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug],
  //   queryFn: () => getWorkoutDetailById({ id: slug }),
  //   placeholderData: keepPreviousData,
  //   // staleTime: 30000,
  // });

  useEffect(() => {
    if (data1) {
      setWorkoutDetail(data1);
    }
  }, [data1]);

  // useEffect(() => {
  //   if (slug) {
  //     refetch();
  //   }
  // }, [slug]);

  const renderWorkingDetails = () => {
    if (isLoading) {
      return <Loading />;
    }
    return <WorkoutDetail />;
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
