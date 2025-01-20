import React from 'react';
import { Platform } from 'react-native';
import Container from '../atoms/Container';
import { tailwind } from '@/utils/tailwind';
import ExerciseDuration from './ExerciseDuration';
import ExerciseStartAndPause from './ExerciseStartAndPause';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import useTimer from '@/hooks/useTimer';

const StartWorkoutBottomBar = () => {
  const { elapsedTime, remainingTime, handlePlay, handlePause, handleStop } = useTimer();

  const totalWorkoutTime = useWorkoutDetailStore(state => state.totalWorkoutTime) ?? 0;
  const isWorkoutCompleted = useWorkoutDetailStore(state => state.isWorkoutCompleted) ?? false;

  const isWorkoutTimerRunning =
    useWorkoutDetailStore(state => state.isWorkoutTimerRunning) ?? false;

  return (
    <Container
      style={Platform.select({
        web: tailwind(
          'flex-0.12 flex-row justify-center gap-4  rounded-lg bg-NAVBAR_BACKGROUND px-[3.31rem] py-[0.63rem]',
        ),
        native: tailwind(
          'flex-0.12 flex-row gap-4 rounded-lg  bg-NAVBAR_BACKGROUND px-[3.31rem] py-[0.63rem] ',
        ),
      })}>
      <Container
        style={Platform.select({
          web: tailwind(' w-full flex-row items-center justify-between'),
          native: tailwind('w-full flex-row items-center justify-between'),
        })}>
        {/* Timer Display */}
        <ExerciseDuration
          remainingTime={remainingTime}
          elapsedTime={elapsedTime}
          totalWorkoutTime={totalWorkoutTime}
        />
        {/* Timer Controls */}
        <ExerciseStartAndPause
          isTimerRunning={isWorkoutTimerRunning}
          onPlay={handlePlay}
          onPause={handlePause}
          onStop={handleStop}
          disableControls={isWorkoutCompleted}
        />
      </Container>
    </Container>
  );
};

export default StartWorkoutBottomBar;
