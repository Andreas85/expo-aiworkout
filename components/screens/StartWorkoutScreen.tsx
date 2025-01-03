import { Platform } from 'react-native';
import React, { memo } from 'react';
import Container from '../atoms/Container';
import StartWorkoutTopBar from '../molecules/StartWorkoutTopBar';
import StartWorkoutExercises from '../molecules/StartWorkoutExercises';
import { tailwind } from '@/utils/tailwind';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import StartWorkoutBottomBar from '../molecules/StartWorkoutBottomBar';

const StartWorkoutScreen = () => {
  const { isLargeScreen } = useWebBreakPoints();
  return (
    <Container style={Platform.select({ web: tailwind('flex-1'), native: tailwind('flex-1') })}>
      <StartWorkoutTopBar />
      <StartWorkoutExercises />
      {isLargeScreen && <StartWorkoutBottomBar />}
    </Container>
  );
};

export default memo(StartWorkoutScreen);
