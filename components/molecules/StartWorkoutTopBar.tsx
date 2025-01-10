import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LayoutAnimation, Platform } from 'react-native';
import Container from '../atoms/Container';
import { tailwind } from '@/utils/tailwind';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import BackActionButton from '../atoms/BackActionButton';
import LabelContainer from '../atoms/LabelContainer';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import CustomSwitch from '../atoms/CustomSwitch';
import ExerciseDuration from './ExerciseDuration';
import ExerciseStartAndPause from './ExerciseStartAndPause';
import pauseable from 'pauseable';
import { debounce } from 'lodash';
import TextContainer from '../atoms/TextContainer';

const StartWorkoutTopBar = () => {
  const { isLargeScreen, isMediumScreen } = useWebBreakPoints();
  const workoutDetail = useWorkoutDetailStore(state => state.workoutDetail);
  const totalWorkoutTime = useWorkoutDetailStore(state => state.totalWorkoutTime) ?? 0;
  const workoutRemainingTime = useWorkoutDetailStore(state => state.remainingTime) ?? 0;
  const isWorkoutTimerRunning =
    useWorkoutDetailStore(state => state.isWorkoutTimerRunning) ?? false;
  const isWorkoutCompleted = useWorkoutDetailStore(state => state.isWorkoutCompleted) ?? false;

  const { updateWorkoutTimer } = useWorkoutDetailStore();
  // Timer states
  const [isEnabled, setIsEnabled] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0); // Total 5 minutes

  const timerRef = useRef<any>(null);

  const handleTimer = () => {
    setElapsedTime(prev => prev + 1);
    setRemainingTime(prev => {
      return prev - 1 > 0 ? prev - 1 : 0;
    });
  };

  useEffect(() => {
    if (workoutRemainingTime) {
      setRemainingTime(workoutRemainingTime);
    }
  }, [workoutRemainingTime]);

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

  // Debounced toggle for custom switch
  const toggleSwitch = useCallback(
    debounce(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsEnabled(prevState => !prevState);
    }, 500), // 500ms delay
    [],
  );

  // Render short version toggle
  const renderVersionTab = () => {
    return (
      <CustomSwitch
        isEnabled={isEnabled}
        toggleSwitch={toggleSwitch}
        label="Short Version"
        containerStyle={[tailwind('my-0')]}
      />
    );
  };

  return (
    <Container
      style={Platform.select({
        web: isLargeScreen ? tailwind('flex flex-col  p-4') : styles.desktop.container,
        native: tailwind('flex flex-col gap-4 p-4'),
      })}>
      <Container
        style={[
          Platform.select({
            web: tailwind(`
               ${isLargeScreen ? '' : 'px-32 pt-4'}
            `),
            native: tailwind('flex-row items-center justify-between space-y-4'),
          }),
        ]}>
        <Container style={[tailwind('flex-1 flex-row flex-wrap items-center gap-2')]}>
          <BackActionButton />
          <LabelContainer
            label={workoutDetail?.name ?? ''}
            labelStyle={[tailwind('text-[1.0625rem] font-bold')]}
            containerStyle={[
              Platform.select({
                web: tailwind(`
                  ${isLargeScreen ? 'flex-1 justify-between' : 'hidden'}
                `),
                native: tailwind('flex-1 justify-between'),
              }),
            ]}
          />
          {!isMediumScreen && renderVersionTab()}
        </Container>

        <Container
          style={Platform.select({
            web: isLargeScreen
              ? tailwind('hidden')
              : tailwind(`
              mx-auto w-[50.5625rem] flex-row items-center justify-between
            `),
            native: tailwind('hidden'),
          })}>
          <TextContainer
            data={`Exercises`}
            style={[
              Platform.select({
                web: isLargeScreen
                  ? tailwind('self-left text-[1rem]')
                  : styles.desktop.exercise_title,
                native: tailwind(' self-left  text-[1rem] font-bold'),
              }),
            ]}
          />
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
      {isMediumScreen && renderVersionTab()}
    </Container>
  );
};

export default StartWorkoutTopBar;

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
