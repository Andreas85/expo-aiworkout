import React from 'react';
import StartWorkoutDetail from '../screens/StartWorkoutDetail';

import { tailwind } from '@/utils/tailwind';
import Container from '../atoms/Container';

const StartWorkoutExercises = () => {
  return (
    <Container style={tailwind('flex-1 pt-10')}>
      <StartWorkoutDetail />
    </Container>
  );
};

export default StartWorkoutExercises;
