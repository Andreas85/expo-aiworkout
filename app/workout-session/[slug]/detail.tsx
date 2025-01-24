// give me  boiler plate code
import { Platform } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientBackground from '@/components/atoms/GradientBackground';
import { tailwind } from '@/utils/tailwind';
import StartWorkoutScreen from '@/components/screens/StartWorkoutScreen';
import useBreakPoints from '@/hooks/useBreakPoints';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { getWorkoutSessionById } from '@/utils/workoutSessionHelper';
import { useAuthStore } from '@/store/authStore';
import { useFetchData } from '@/hooks/useFetchData';
import { getWorkoutSessionDetail } from '@/services/workouts';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';

const WorkoutSessionDetail = () => {
  const { slug } = useLocalSearchParams() as { slug: string; sessionId?: string };
  const { isLargeScreen } = useBreakPoints();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const {
    setWorkoutDetail,
    updateIsWorkoutSessionDetailScreenTimerPaused,
    updateWorkoutSessionDetailScreen,
  } = useWorkoutDetailStore();

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

  useEffect(() => {
    console.log('dataWorkoutSessionDetails', dataWorkoutSessionDetails);
    if (isAuthenticated && dataWorkoutSessionDetails?.data) {
      const results = dataWorkoutSessionDetails?.data?.workout;
      const updatedData = { ...results, status: dataWorkoutSessionDetails?.data?.status };
      // console.log('(isAuthenticated-workout-session-details) INFO:: ', updatedData);
      setWorkoutDetail(updatedData);
    }
  }, [isAuthenticated, dataWorkoutSessionDetails?.data]);

  const getWorkoutSessionFromStorage = async () => {
    const result: any = await getWorkoutSessionById(slug ?? '');
    if (result) {
      setWorkoutDetail(result);
      return;
    }
  };

  const renderScreenData = () => {
    return <StartWorkoutScreen />;
  };

  const fetchInitials = async () => {
    updateIsWorkoutSessionDetailScreenTimerPaused(true);
    updateWorkoutSessionDetailScreen(true);
    if (isAuthenticated) {
      // console.log('data', slug);
      refetch();
    } else {
      getWorkoutSessionFromStorage();
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchInitials();
      // fetchInitials();
      // Cleanup function or additional logic when screen is unfocused
      return async () => {
        updateIsWorkoutSessionDetailScreenTimerPaused(false);
        updateWorkoutSessionDetailScreen(false);
      };
    }, []),
  );

  return (
    <SafeAreaView style={tailwind('flex-1')}>
      <GradientBackground
        styleNative={[
          Platform.select({
            web: tailwind(`${!isLargeScreen ? 'mt-24' : ''} flex-1`),
            native: tailwind('!mt-0 flex-1'),
          }),
        ]}>
        {/* <Text>asdfas</Text> */}
        {renderScreenData()}
      </GradientBackground>
    </SafeAreaView>
  );
};

export default WorkoutSessionDetail;
