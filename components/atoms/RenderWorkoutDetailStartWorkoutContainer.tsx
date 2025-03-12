import React, { useState } from 'react';
import Container from './Container';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { tailwind } from '@/utils/tailwind';
import { ActionButton } from './ActionButton';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { Platform } from 'react-native';
import useWorkoutSessionDetailsTracking from '@/hooks/useWorkoutSessionDetails';

export default function RenderWorkoutDetailStartWorkoutContainer() {
  const { isLargeScreen } = useWebBreakPoints();
  const hasExercise = useWorkoutDetailStore(state => state.hasExercise);
  const { handleAddWorkoutSession } = useWorkoutSessionDetailsTracking();

  const [loading, setLoading] = useState(false);

  const handleStartWorkoutClick = () => {
    handleAddWorkoutSession({ setLoading });
  };

  if (hasExercise) {
    return (
      <Container
        style={[
          Platform.select({
            web: tailwind(
              `${isLargeScreen ? ' p-4' : 'absolute bottom-3   items-center justify-center self-center px-4'}`,
            ),

            native: tailwind('absolute bottom-0 left-0 right-0  flex-1 bg-NAVBAR_BACKGROUND p-4 '),
          }),
        ]}>
        <ActionButton
          label="Start workout"
          uppercase
          isLoading={loading}
          onPress={handleStartWorkoutClick}
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
}
