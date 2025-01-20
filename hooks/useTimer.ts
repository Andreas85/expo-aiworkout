import { useEffect, useRef, useState } from 'react';
import pauseable from 'pauseable';
import { useWorkoutDetailStore } from '@/store/workoutdetail';

const useTimer = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const timerRef = useRef<any>(null);

  const isWorkoutTimerRunning =
    useWorkoutDetailStore(state => state.isWorkoutTimerRunning) ?? false;
  const isWorkoutSessionDetailScreenTimerPaused = useWorkoutDetailStore(
    state => state.isWorkoutSessionDetailScreenTimerPaused,
  );
  const workoutRemainingTime = useWorkoutDetailStore(state => state.remainingTime) ?? 0;
  const totalWorkoutTime = useWorkoutDetailStore(state => state.totalWorkoutTime) ?? 0;
  const { updateWorkoutTimer } = useWorkoutDetailStore();

  const handleTimer = () => {
    setElapsedTime(prev => prev + 1);
    setRemainingTime(prev => prev - 1);
  };

  useEffect(() => {
    if (workoutRemainingTime) {
      setRemainingTime(workoutRemainingTime);
    }
  }, [workoutRemainingTime]);

  // Initialize the pauseable timer
  useEffect(() => {
    timerRef.current = pauseable.setInterval(() => {
      if (isWorkoutTimerRunning && !isWorkoutSessionDetailScreenTimerPaused) {
        handleTimer();
        return;
      }
      handlePause();
    }, 1000);
    return () => {
      timerRef.current?.clear();
    };
  }, [isWorkoutTimerRunning, isWorkoutSessionDetailScreenTimerPaused]);

  const handlePlay = () => {
    updateWorkoutTimer(true);
    if (timerRef.current) {
      timerRef.current.resume();
    }
  };

  function handlePause() {
    updateWorkoutTimer(false);
    if (timerRef.current) {
      timerRef.current.pause();
    }
  }

  const handleStop = () => {
    updateWorkoutTimer(false);
    if (timerRef.current) {
      timerRef.current.clear();
    }
    setElapsedTime(0);
    setRemainingTime(totalWorkoutTime);
  };

  return {
    elapsedTime,
    remainingTime,
    handlePlay,
    handlePause,
    handleStop,
  };
};

export default useTimer;
