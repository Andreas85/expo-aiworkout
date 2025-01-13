import React, { memo, useEffect, useRef, useState } from 'react';
import { ExerciseElement } from '@/services/interfaces';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import pauseable from 'pauseable';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import ActiveRestCard from './ActiveRestCard';
import ActiveCard from './ActiveCard';

interface StartWorkoutExerciseCardActiveProps {
  index: number;
  item: ExerciseElement;
  isEnabled?: boolean;
  isRestCard?: boolean;
  onDecrementHandler: () => void;
  onIncrementHandler: () => void;
  isExerciseTimeFinished: (
    exerciseDurationTaken: number,
    currentExerciseCompleted: boolean,
  ) => void;
  isRepsWorkoutFinished: (totalElapsedTime: number) => void;
}

const StartWorkoutExerciseCardActive = (props: StartWorkoutExerciseCardActiveProps) => {
  const { item, index, isExerciseTimeFinished, isRepsWorkoutFinished, isRestCard } = props;
  const { isLargeScreen } = useWebBreakPoints();
  const timerRef = useRef<any>(null);
  const [totalElapsedTime, setTotalElapsedTime] = useState<number>(1);
  const elapsedTimeRef = useRef<number>(1); // Track the current value with a ref
  const isWorkoutSessionDetailScreenTimerPaused = useWorkoutDetailStore(
    state => state.isWorkoutSessionDetailScreenTimerPaused,
  );
  const isWorkoutTimerRunning =
    useWorkoutDetailStore(state => state.isWorkoutTimerRunning) ?? false;

  const exerciseDurationCompletedEvent = () => {
    isExerciseTimeFinished?.(elapsedTimeRef.current, true);
  };

  const repsWorkoutFinishedEvent = () => {
    isRepsWorkoutFinished?.(elapsedTimeRef.current);
  };

  const updateTimer = () => {
    const { duration, reps, rest } = item ?? {};
    // console.log('Timer running:', {
    //   totalElapsedTime,
    //   duration,
    //   reps,
    //   refElapsed: elapsedTimeRef.current,
    //   isRestCard,
    //   item,
    // });

    if (isRestCard && elapsedTimeRef.current >= rest) {
      console.log('Rest duration reached, triggering event');
      exerciseDurationCompletedEvent();
      return;
    }

    if (elapsedTimeRef.current >= duration && !reps) {
      console.log('Duration reached without reps, triggering event');
      exerciseDurationCompletedEvent();
      return;
    }

    if (reps && elapsedTimeRef.current >= duration) {
      console.log('Reps workout completed, triggering event');
      repsWorkoutFinishedEvent();
      return;
    }
    elapsedTimeRef.current += 1; // Update the ref value
    setTotalElapsedTime(elapsedTimeRef.current); // Trigger a re-render
  };

  useEffect(() => {
    if (!item) return;

    // console.log('Initializing timer for item:', item);

    timerRef.current = pauseable.setInterval(() => {
      if (isWorkoutTimerRunning && !isWorkoutSessionDetailScreenTimerPaused) {
        updateTimer();
      }
    }, 1000);

    return () => {
      // console.log('Clearing timer');
      timerRef.current?.clear();
    };
  }, [item, isWorkoutTimerRunning, isWorkoutSessionDetailScreenTimerPaused]);

  if (isRestCard) {
    return <ActiveRestCard item={item} index={index} />;
  }

  return <ActiveCard item={item} index={index} handleFinish={exerciseDurationCompletedEvent} />;
};

export default memo(StartWorkoutExerciseCardActive);
