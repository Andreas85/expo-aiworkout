import { Platform } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientBackground from '@/components/atoms/GradientBackground';
import { tailwind } from '@/utils/tailwind';
import StartWorkoutScreen from '@/components/screens/StartWorkoutScreen';
import useBreakPoints from '@/hooks/useBreakPoints';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { getWorkoutSessionById } from '@/utils/workoutSessionHelper';
import { useAuthStore } from '@/store/authStore';
import { useFetchData } from '@/hooks/useFetchData';
import { getWorkoutSessionDetail } from '@/services/workouts';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';
import { useWorkoutSessionStore } from '@/store/workoutSessiondetail';
import { useKeepAwake } from 'expo-keep-awake';

const WorkoutSessionDetail = () => {
  useKeepAwake();
  const { slug } = useLocalSearchParams() as { slug: string; sessionId?: string };
  const { isLargeScreen } = useBreakPoints();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const userData = useAuthStore(state => state.userData);
  const {
    setWorkoutSessionDetails,
    updateWorkoutTimer,
    updateIsActiveRepExerciseCard,
    updateIsWorkoutOwner,
  } = useWorkoutSessionStore();

  const { data: dataWorkoutSessionDetails, refetch } = useFetchData({
    queryFn: async () => {
      const response = await getWorkoutSessionDetail({
        id: slug,
      });
      return response;
    },
    enabled: false,
    queryKey: [REACT_QUERY_API_KEYS.WORKOUT_SESSION_USER_DETAILS, slug],
  });

  const getWorkoutSessionFromStorage = async () => {
    const result: any = await getWorkoutSessionById(slug ?? '');
    if (result) {
      setWorkoutSessionDetails(result);
      updateWorkoutTimer(true);
      updateIsActiveRepExerciseCard?.(false);
      return;
    }
  };

  useEffect(() => {
    if (isAuthenticated && dataWorkoutSessionDetails?.data) {
      const results = dataWorkoutSessionDetails?.data?.workout;
      // const workoutOwnerId = dataWorkoutSessionDetails?.data?.user;
      const updatedData = {
        ...results,
        status: dataWorkoutSessionDetails?.data?.status,
        // isWorkoutOwner: workoutOwnerId === userData?._id,
      };

      const ownerId = dataWorkoutSessionDetails?.data?.workout?.createdBy;
      const isWorkoutOwner = ownerId === userData?._id;

      // console.log('(isAuthenticated-workout-session) INFO:: ', {
      //   ownerId,
      //   isWorkoutOwner,
      //   userId: userData?._id,
      // });
      setWorkoutSessionDetails(updatedData);
      updateIsWorkoutOwner(isWorkoutOwner);
      updateWorkoutTimer(true);
      updateIsActiveRepExerciseCard?.(false);
    }
  }, [isAuthenticated, dataWorkoutSessionDetails?.data]);

  const fetchInitials = () => {
    if (isAuthenticated) {
      refetch();
      console.log('fetchInitials');
    } else {
      getWorkoutSessionFromStorage();
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchInitials();
    }, [isAuthenticated]),
  );

  const renderScreenData = () => {
    return <StartWorkoutScreen />;
  };
  return (
    <SafeAreaView style={tailwind('flex-1')}>
      <GradientBackground
        styleNative={[
          Platform.select({
            web: tailwind(`${!isLargeScreen ? 'mt-24' : ''} flex-1`),
            native: tailwind('!mt-0 flex-1'),
          }),
        ]}>
        {renderScreenData()}
      </GradientBackground>
    </SafeAreaView>
  );
};

export default WorkoutSessionDetail;
