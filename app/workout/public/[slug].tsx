import React, { useEffect } from 'react';
import GradientBackground from '@/components/atoms/GradientBackground';
import WorkoutDetail from '@/components/screens/WorkoutDetail';
import { useLocalSearchParams } from 'expo-router';
import Loading from '@/components/atoms/Loading';
import { fetchPublicWorkoutServiceById } from '@/services/workouts';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';
import { useFetchData } from '@/hooks/useFetchData';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tailwind } from '@/utils/tailwind';

const PublicWorkoutDetailIndex = () => {
  const { slug } = useLocalSearchParams();

  const { setWorkoutDetail } = useWorkoutDetailStore();
  const { data, isPending, refetch } = useFetchData({
    queryFn: () => fetchPublicWorkoutServiceById({ id: slug }),
    queryKey: [REACT_QUERY_API_KEYS.PUBLIC_WORKOUT_DETAILS, slug],
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
    return <WorkoutDetail isPublicWorkout={true} />;
  };
  return (
    <SafeAreaView style={[tailwind('flex-1')]}>
      <GradientBackground>{renderWorkingDetails()}</GradientBackground>
    </SafeAreaView>
  );
};

export default PublicWorkoutDetailIndex;
