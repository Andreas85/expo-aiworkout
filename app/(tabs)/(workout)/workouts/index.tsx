import GradientBackground from '@/components/atoms/GradientBackground';
import MyWorkout from '@/components/screens/MyWorkout';
import React from 'react';

export default function WorkoutIndexRoute() {
  return (
    <GradientBackground styleWeb="!mt-0">
      <MyWorkout />
    </GradientBackground>
  );
}
