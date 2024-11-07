import React, { useEffect } from 'react';
import GradientBackground from '@/components/atoms/GradientBackground';
import { useLocalSearchParams } from 'expo-router';
import Loading from '@/components/atoms/Loading';
import { fetchPublicWorkoutServiceById } from '@/services/workouts';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';
import { useFetchData } from '@/hooks/useFetchData';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tailwind } from '@/utils/tailwind';
import PublicWorkoutDetail from '@/components/screens/PublicWorkoutDetail';
import { Platform } from 'react-native';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/utils/helper';

const PublicWorkoutDetailIndex = () => {
  const { slug } = useLocalSearchParams();
  const { isLargeScreen } = useWebBreakPoints();

  const { setWorkoutDetail } = useWorkoutDetailStore();
  // const { data, isLoading, refetch } = useFetchData({
  //   queryFn: () => fetchPublicWorkoutServiceById({ id: slug }),
  //   queryKey: [REACT_QUERY_API_KEYS.PUBLIC_WORKOUT_DETAILS, slug],
  //   keepPreviousData: keepPreviousData,
  //   enabled: false,
  // });
  const data1 = queryClient.getQueryData([REACT_QUERY_API_KEYS.PUBLIC_WORKOUT_DETAILS, slug]);

  const { data, isLoading, refetch } = useQuery({
    queryFn: () => fetchPublicWorkoutServiceById({ id: slug }),
    queryKey: [REACT_QUERY_API_KEYS.PUBLIC_WORKOUT_DETAILS, slug],
    // staleTime: 30000, // Eg: 60 * 1000 = 1 minute,
    enabled: false,
  });
  console.log(data1, 'data1');
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
    return <PublicWorkoutDetail />;
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
