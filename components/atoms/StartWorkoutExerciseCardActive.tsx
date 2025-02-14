import React, { memo, useEffect, useRef, useState } from 'react';
import { ExerciseElement } from '@/services/interfaces';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import pauseable from 'pauseable';
import ActiveRestCard from './ActiveRestCard';
import ActiveCard from './ActiveCard';
import { useWorkoutSessionStore } from '@/store/workoutSessiondetail';
import { View } from 'react-native';

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
  onItemLayoutWrapperActiveCard: (event: any) => void;
}

const StartWorkoutExerciseCardActive = (props: StartWorkoutExerciseCardActiveProps) => {
  const {
    item,
    index,
    isExerciseTimeFinished,
    isRepsWorkoutFinished,
    isRestCard,
    onItemLayoutWrapperActiveCard,
  } = props;
  const { isLargeScreen } = useWebBreakPoints();
  const timerRef = useRef<any>(null);
  const [totalElapsedTime, setTotalElapsedTime] = useState<number>(1);
  const elapsedTimeRef = useRef<number>(1); // Track the current value with a ref
  const isWorkoutSessionDetailScreenTimerPaused = useWorkoutSessionStore(
    state => state.isWorkoutSessionDetailScreenTimerPaused,
  );
  const isWorkoutTimerRunning =
    useWorkoutSessionStore(state => state.isWorkoutTimerRunning) ?? false;

  const exerciseDurationCompletedEvent = () => {
    isExerciseTimeFinished?.(elapsedTimeRef.current, true);
  };

  const repsWorkoutFinishedEvent = () => {
    isRepsWorkoutFinished?.(elapsedTimeRef.current);
  };

  const handleFinish = () => {
    console.log('Finish button clicked');
    repsWorkoutFinishedEvent();
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
    return (
      <View onLayout={event => onItemLayoutWrapperActiveCard(event)}>
        <ActiveRestCard item={item} index={index} />
      </View>
    );
  }

  return (
    <View
      onLayout={event => {
        console.log('Active card layout', event);
        onItemLayoutWrapperActiveCard(event);
      }}>
      <ActiveCard item={item} index={index} handleFinish={handleFinish} />
    </View>
  );
};

export default memo(StartWorkoutExerciseCardActive);
