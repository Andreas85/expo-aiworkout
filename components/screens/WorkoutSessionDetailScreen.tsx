import { Platform } from 'react-native';
import React, { memo } from 'react';
import Container from '../atoms/Container';
import { tailwind } from '@/utils/tailwind';
import WorkoutSessionHeader from '../molecules/WorkoutSessionHeader';
import WorkoutSessionInfoExercisesList from './WorkoutSessionInfoExercisesList';

const WorkoutSessionDetailScreen = () => {
  return (
    <Container style={Platform.select({ web: tailwind('flex-1'), native: tailwind('flex-1') })}>
      <WorkoutSessionHeader />
      <WorkoutSessionInfoExercisesList />
    </Container>
  );
};

export default memo(WorkoutSessionDetailScreen);
