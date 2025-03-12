import React from 'react';
import Container from './Container';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { tailwind } from '@/utils/tailwind';
import NoDataSvg from '../svgs/NoDataSvg';
import DraggableExercises from '../molecules/DraggableExercises';

export default function RenderWorkoutDetailExercises(props: {
  setIsPendingExerciseCardAction: () => void;
}) {
  const { setIsPendingExerciseCardAction } = props;
  const hasExercise = useWorkoutDetailStore(state => state.hasExercise);
  if (!hasExercise) {
    return (
      <Container style={tailwind('flex-1')}>
        <NoDataSvg label="No exercises" message={'Start building your workout'} />
      </Container>
    );
  }
  return (
    <>
      <DraggableExercises setIsPendingExerciseCardAction={setIsPendingExerciseCardAction} />
    </>
  );
}
