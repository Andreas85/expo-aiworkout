import React, { memo } from 'react';
import StartWorkoutDetail from '../screens/StartWorkoutDetail';

import { tailwind } from '@/utils/tailwind';
import Container from '../atoms/Container';
import { Platform } from 'react-native';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';

const StartWorkoutExercises = () => {
  const { isLargeScreen } = useWebBreakPoints();
  return (
    <Container
      style={Platform.select({
        web: isLargeScreen ? tailwind('flex-1') : tailwind('flex-1  pt-10'),
        native: tailwind('flex-1'),
      })}>
      <StartWorkoutDetail />
    </Container>
  );
};

export default memo(StartWorkoutExercises);
