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

const WorkoutDetailIndex = () => {
  const { slug } = useLocalSearchParams();
  const { setWorkoutDetail } = useWorkoutDetailStore();
  const { data, isPending, refetch } = useFetchData({
    queryFn: () => getWorkoutDetailById({ id: slug }),
    queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug],
    staleTime: 60 * 1000,
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

  const renderWorkingDetails = () => {
    if (isPending) {
      return <Loading />;
    }
    return <WorkoutDetail />;
  };
  return (
    <SafeAreaView style={[tailwind('flex-1')]}>
      <GradientBackground>{renderWorkingDetails()}</GradientBackground>
    </SafeAreaView>
  );
};

export default WorkoutDetailIndex;
