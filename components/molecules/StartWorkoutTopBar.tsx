import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Container from '../atoms/Container';
import { tailwind } from '@/utils/tailwind';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import BackActionButton from '../atoms/BackActionButton';
import LabelContainer from '../atoms/LabelContainer';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import ExerciseDuration from './ExerciseDuration';
import ExerciseStartAndPause from './ExerciseStartAndPause';
import TextContainer from '../atoms/TextContainer';
import { interactionStore } from '@/store/interactionStore';
import useTimer from '@/hooks/useTimer';

const StartWorkoutTopBar = () => {
  const { isLargeScreen } = useWebBreakPoints();
  const hasUserInteracted = interactionStore(state => state.hasInteracted);
  const { elapsedTime, remainingTime, handlePlay, handlePause, handleStop } = useTimer();
  const workoutDetail = useWorkoutDetailStore(state => state.workoutDetail);
  const totalWorkoutTime = useWorkoutDetailStore(state => state.totalWorkoutTime) ?? 0;
  const isWorkoutTimerRunning =
    useWorkoutDetailStore(state => state.isWorkoutTimerRunning) ?? false;
  const isWorkoutCompleted = useWorkoutDetailStore(state => state.isWorkoutCompleted) ?? false;

  const [isMuted, setIsMuted] = useState<boolean>(Platform.OS === 'web'); // Default mute state based on platform

  // Debounced toggle for custom switch

  useEffect(() => {
    if (Platform.OS === 'web') {
      setIsMuted(!hasUserInteracted);
    }
  }, [hasUserInteracted]);

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
      </Container>
    </Container>
  );
};

export default StartWorkoutTopBar;

const styles = {
  muteIconText: {
    fontSize: 24,
    color: '#fff',
  },
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
