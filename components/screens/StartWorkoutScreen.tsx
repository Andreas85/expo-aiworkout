import { Platform } from 'react-native';
import React from 'react';
import Container from '../atoms/Container';
import StartWorkoutTopBar from '../molecules/StartWorkoutTopBar';
import StartWorkoutExercises from '../molecules/StartWorkoutExercises';
import { tailwind } from '@/utils/tailwind';

const StartWorkoutScreen = () => {
  return (
    <Container style={Platform.select({ web: tailwind(''), native: tailwind('flex-1') })}>
      <StartWorkoutTopBar />
      <StartWorkoutExercises />
    </Container>
  );
};

export default StartWorkoutScreen;
