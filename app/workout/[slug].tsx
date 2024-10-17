import React, { useEffect } from 'react';
import GradientBackground from '@/components/atoms/GradientBackground';
import WorkoutDetail from '@/components/screens/WorkoutDetail';
import { useLocalSearchParams } from 'expo-router';
import { useFetchData } from '@/hooks/useFetchData';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';
import { getWorkoutDetailById } from '@/services/workouts';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import Loading from '@/components/atoms/Loading';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tailwind } from '@/utils/tailwind';
import { Platform } from 'react-native';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';

const WorkoutDetailIndex = () => {
  const { slug } = useLocalSearchParams();
  const { isLargeScreen } = useWebBreakPoints();
  const isLoadingWorkout = useWorkoutDetailStore(state => state.isLoading);
  const { setWorkoutDetail, setLoadingWorkout } = useWorkoutDetailStore();
  const { data, refetch, fetchStatus } = useFetchData({
    queryFn: () => getWorkoutDetailById({ id: slug }),
    queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug],
  });

  useEffect(() => {
    if (data) {
      setWorkoutDetail(data);
    }
  }, [data]);

  useEffect(() => {
    if (slug) {
      refetch();
    }
  }, [slug]);

  useEffect(() => {
    if (fetchStatus === 'fetching') {
      setLoadingWorkout(true);
      return;
    }
    setLoadingWorkout(false);
  }, [fetchStatus]);

  const renderWorkingDetails = () => {
    if (isLoadingWorkout) {
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
