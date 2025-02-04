import React from 'react';
import Container from '../atoms/Container';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { tailwind } from '@/utils/tailwind';
import RenderWorkoutSessionDetailExercises from '../atoms/RenderWorkoutSessionDetailExercises';
import LabelContainer from '../atoms/LabelContainer';
import { Platform } from 'react-native';
import { useWorkoutSessionStore } from '@/store/workoutSessiondetail';
import { ActionButton } from '../atoms/ActionButton';
import { router, useLocalSearchParams } from 'expo-router';

const WorkoutSessionInfoExercisesList = () => {
  const { isLargeScreen } = useWebBreakPoints();
  const { slug } = useLocalSearchParams() as { slug: string; sessionId?: string };
  const status = useWorkoutSessionStore(state => state.workoutSessionDetails?.status);
  const hasExerciseWorkoutSession = useWorkoutSessionStore(state => state.hasExercises);

  const handleContinueWorkoutClick = () => {
    router.push(`/workout-session/${slug}/detail` as any);
  };

  const renderBottomContainer = () => {
    if (hasExerciseWorkoutSession && status?.toUpperCase() === 'PENDING') {
      return (
        <Container
          style={[
            Platform.select({
              web: tailwind(
                `${isLargeScreen ? ' p-4' : 'absolute bottom-3   items-center justify-center self-center px-4'}`,
              ),

              native: tailwind(
                'absolute bottom-0 left-0 right-0  flex-1 bg-NAVBAR_BACKGROUND p-4 ',
              ),
            }),
          ]}>
          <ActionButton
            label="Continue workout"
            uppercase
            onPress={handleContinueWorkoutClick}
            style={[
              Platform.select({
                web: tailwind(
                  `${isLargeScreen ? 'w-full' : 'h-[3.6875rem] w-[23.0625rem]'} flex  shrink-0 items-center justify-center gap-2.5 rounded-lg px-2.5 py-3`,
                ),
                native: tailwind('rounded-lg '),
              }),
            ]}
          />
        </Container>
      );
    }
  };
  return (
    <>
      <Container
        style={tailwind(`h-full w-full flex-1 px-4 ${!isLargeScreen ? 'my-4 px-32' : ''} `)}>
        <Container>
          <LabelContainer
            label="Exercises"
            labelStyle={[
              Platform.select({
                web: tailwind(
                  ` ${isLargeScreen ? 'text-[1rem]' : 'text-[2rem]'}  font-normal not-italic leading-[150%] text-white`,
                ),
                native: tailwind('text-lg font-bold'),
              }),
            ]}
            containerStyle={[
              Platform.select({
                web: tailwind('w-full text-left'),
                native: tailwind('w-full text-left'),
              }),
            ]}
          />
          <Container style={[tailwind('mb-4 border-[0.5px] border-white')]} />
        </Container>
        <RenderWorkoutSessionDetailExercises />
        {renderBottomContainer()}
      </Container>
    </>
  );
};

export default WorkoutSessionInfoExercisesList;
