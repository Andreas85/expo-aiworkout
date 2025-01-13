// give me  boiler plate code
import { Platform } from 'react-native';
import React, { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientBackground from '@/components/atoms/GradientBackground';
import { tailwind } from '@/utils/tailwind';
import StartWorkoutScreen from '@/components/screens/StartWorkoutScreen';
import useBreakPoints from '@/hooks/useBreakPoints';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { getWorkoutSessionById } from '@/utils/workoutSessionHelper';

const WorkoutSessionDetail = () => {
  const { slug } = useLocalSearchParams() as { slug: string; sessionId?: string };
  const { isLargeScreen } = useBreakPoints();
  const { setWorkoutDetail, updateIsWorkoutSessionDetailScreenTimerPaused } =
    useWorkoutDetailStore();

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

  useFocusEffect(
    useCallback(() => {
      getWorkoutSessionFromStorage();
      updateIsWorkoutSessionDetailScreenTimerPaused(true);

      // fetchInitials();
      // Cleanup function or additional logic when screen is unfocused
      return async () => {
        updateIsWorkoutSessionDetailScreenTimerPaused(false);
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
