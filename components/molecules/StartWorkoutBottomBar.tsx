import React, { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import Container from '../atoms/Container';
import { tailwind } from '@/utils/tailwind';
import ExerciseDuration from './ExerciseDuration';
import ExerciseStartAndPause from './ExerciseStartAndPause';
import pauseable from 'pauseable';
import { useWorkoutDetailStore } from '@/store/workoutdetail';

const StartWorkoutBottomBar = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const totalWorkoutTime = useWorkoutDetailStore(state => state.totalWorkoutTime) ?? 0;
  const isWorkoutCompleted = useWorkoutDetailStore(state => state.isWorkoutCompleted) ?? false;

  const isWorkoutTimerRunning =
    useWorkoutDetailStore(state => state.isWorkoutTimerRunning) ?? false;
  const { updateWorkoutTimer } = useWorkoutDetailStore();
  const [remainingTime, setRemainingTime] = useState(0); // Total 5 minutes

  const timerRef = useRef<any>(null);

  const handleTimer = () => {
    setElapsedTime(prev => prev + 1);
    setRemainingTime(prev => prev - 1);
  };

  useEffect(() => {
    if (totalWorkoutTime) {
      setRemainingTime(totalWorkoutTime);
    }
  }, [totalWorkoutTime]);

  // Timer controls
  const handlePlay = () => {
    console.log('Play', { isWorkoutTimerRunning, reftime: timerRef.current });
    updateWorkoutTimer(true);
    if (timerRef.current) {
      timerRef.current.resume(); // Ensure `start` is called on a valid instance
    }
  };

  const handlePause = () => {
    updateWorkoutTimer(false);
    if (timerRef.current) {
      timerRef.current.pause(); // Ensure `pause` is called on a valid instance
    }
  };

  const handleStop = () => {
    updateWorkoutTimer(false);
    if (timerRef.current) {
      timerRef.current.clear(); // Clear the timer and reset values
    }

    setElapsedTime(0);
    setRemainingTime(totalWorkoutTime); // Reset to total time
  };

  // Initialize the pauseable timer
  useEffect(() => {
    timerRef.current = pauseable.setInterval(() => {
      if (isWorkoutTimerRunning) {
        handleTimer();
        return;
      }
      handlePause();
    }, 1000);
    return () => {
      timerRef.current?.clear();
    };
  }, [isWorkoutTimerRunning]);

  useEffect(() => {
    updateWorkoutTimer(true);
  }, []);

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

const styles = {
  desktop: {
    container: {
      borderTopLeftRadius: '0rem',
      borderTopRightRadius: '0rem',
      borderBottomRightRadius: '12.5rem',
      borderBottomLeftRadius: '12.5rem',
      backgroundColor: '#252425',
      // height: '100%',
      boxShadow: '0px 12px 24px 4px rgba(95, 63, 102, 0.50)',
    },
    containerInfo: {
      display: 'flex',
      width: '50.5625rem',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    exercise_title: {
      color: '#FFF',
      textAlign: 'left',
      fontSize: '32px',
      fontStyle: 'normal',
      fontWeight: '700',
      lineHeight: '150%',
    },
  },
};
