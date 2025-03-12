import React, { useEffect } from 'react';
import GradientBackground from '@/components/atoms/GradientBackground';
import WorkoutDetail from '@/components/screens/WorkoutDetail';
import { useLocalSearchParams } from 'expo-router';
import {
  REACT_QUERY_API_KEYS,
  REACT_QUERY_STALE_TIME,
  STORAGE_EMITTER_KEYS,
} from '@/utils/appConstants';
import { fetchPublicExerciseService, getWorkoutDetailById } from '@/services/workouts';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import Loading from '@/components/atoms/Loading';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tailwind } from '@/utils/tailwind';
import { DeviceEventEmitter, Platform } from 'react-native';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { useQueryClient } from '@tanstack/react-query';
import { useFetchData } from '@/hooks/useFetchData';
import { useAuthStore } from '@/store/authStore';
import { getWorkoutDetail } from '@/utils/workoutStorageOperationHelper';

const WorkoutDetailIndex = () => {
  const queryClient = useQueryClient();
  const { slug } = useLocalSearchParams() as { slug: string };
  const { isLargeScreen } = useWebBreakPoints();
  const { setWorkoutDetail } = useWorkoutDetailStore();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const workoutDetail = useWorkoutDetailStore(state => state.workoutDetail);

  // const cachedData: any = queryClient.getQueryData([REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug]);
  useFetchData({
    queryFn: fetchPublicExerciseService,
    queryKey: [REACT_QUERY_API_KEYS.PUBLIC_EXERCISES],
    staleTime: REACT_QUERY_STALE_TIME.PUBLIC_EXERCISES,
  });

  const { data, refetch, isLoading, isStale } = useFetchData({
    queryFn: async () => {
      const response = await getWorkoutDetailById({ id: slug });
      console.log({ response });
      setWorkoutDetail(response);
      return response;
    },
    staleTime: REACT_QUERY_STALE_TIME.MY_WORKOUT_DETAILS,
    enabled: false,
    queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug],
  });

  // Uncomment this block of code if you want to use the cached data

  const refetchWorkoutData = async (workoutId: string) => {
    const updatedData = await getWorkoutDetail(workoutId);
    setWorkoutDetail(updatedData);
  };

  useEffect(() => {
    // Event listener for workout updates
    if (isAuthenticated) return;
    refetchWorkoutData(slug);
    const workoutUpdatedListener = DeviceEventEmitter.addListener(
      STORAGE_EMITTER_KEYS.REFRESH_WORKOUT_DETAILS,
      event => {
        console.log('(REFERSH):: Event:', event);
        if (event.workoutId === slug) {
          refetchWorkoutData(slug); // Refetch workout details
        }
      },
    );

    // Cleanup the listener on unmount
    return () => {
      workoutUpdatedListener.remove();
    };
  }, [slug]);

  useEffect(() => {
    if (isAuthenticated) {
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
