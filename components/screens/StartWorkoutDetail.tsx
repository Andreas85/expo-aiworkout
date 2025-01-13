import React, { useEffect, useState } from 'react';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import Container from '../atoms/Container';
import { useNavigation } from 'expo-router';

import { Platform, View } from 'react-native';
import { tailwind } from '@/utils/tailwind';

import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import NoDataSvg from '../svgs/NoDataSvg';

import StartWorkoutExercisesList from '../molecules/StartWorkoutExercisesList';

const StartWorkoutDetail = (props: { isPublicWorkout?: boolean }) => {
  const { isPublicWorkout = false } = props;
  const navigation = useNavigation();
  const workoutDetail = useWorkoutDetailStore(state => state.workoutDetail);
  const hasExercise = useWorkoutDetailStore(state => state.hasExercise);
  const [isEnabled] = useState<boolean>(false);
  const { isLargeScreen } = useWebBreakPoints();

  useEffect(() => {
    if (workoutDetail) {
      navigation.setOptions({ title: `Workout: ${workoutDetail.name ?? ''}`, unmountOnBlur: true });
    }
  }, [workoutDetail]);

  const renderWorkoutExercises = () => {
    if (!hasExercise) {
      return (
        <Container style={tailwind('flex-1')}>
          <NoDataSvg
            label="No exercises "
            message={!isPublicWorkout ? 'Start building your workout' : ''}
          />
        </Container>
      );
    }

    return (
      <View style={tailwind('flex-1 pb-4')}>
        <StartWorkoutExercisesList isEnabled={isEnabled} />
      </View>
    );
  };

  return (
    <Container style={[tailwind(`flex-1 `)]}>
      <Container
        style={[
          Platform.select({
            web: tailwind(`
                mx-auto  flex-1 
              ${isLargeScreen ? 'w-full' : 'w-full px-32 '}
            `),
            native: tailwind('flex-1'),
          }),
        ]}>
        {renderWorkoutExercises()}
      </Container>
    </Container>
  );
};

export default StartWorkoutDetail;
