import { Platform } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientBackground from '@/components/atoms/GradientBackground';
import { tailwind } from '@/utils/tailwind';
import StartWorkoutScreen from '@/components/screens/StartWorkoutScreen';
import useBreakPoints from '@/hooks/useBreakPoints';
import { useLocalSearchParams } from 'expo-router';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { getWorkoutSessionById } from '@/utils/workoutSessionHelper';

const WorkoutSessionDetail = () => {
  const { slug } = useLocalSearchParams() as { slug: string; sessionId?: string };
  const { isLargeScreen } = useBreakPoints();
  const { setWorkoutDetail, updateWorkoutTimer } = useWorkoutDetailStore();

  const getWorkoutSessionFromStorage = async () => {
    const result: any = await getWorkoutSessionById(slug ?? '');
    if (result) {
      setWorkoutDetail(result);
      updateWorkoutTimer(true);
      return;
    }
  };

  useEffect(() => {
    getWorkoutSessionFromStorage();
  }, [slug]);

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
