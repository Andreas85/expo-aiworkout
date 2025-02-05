import React from 'react';
import { Platform } from 'react-native';
import Container from './Container';
import ShowLabelValue from './ShowLabelValue';
import { Text } from '../Themed';
import { tailwind } from '@/utils/tailwind';
import { ExerciseElement } from '@/services/interfaces';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { debouncedMutate, pluralise } from '@/utils/helper';
import MinusActionButton from './MinusActionButton';
import PlusActionButton from './PlusActionButton';
import ActiveWorkoutIcon from './ActiveWorkoutIcon';
import { updateExerciseProperty } from '@/utils/workoutSessionHelper';
import { useLocalSearchParams } from 'expo-router';
import { useWorkoutSessionStore } from '@/store/workoutSessiondetail';
import { useAuthStore } from '@/store/authStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateExerciseToWorkoutRequest } from '@/services/workouts';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { updateExercisePropertyOfWorkout } from '@/utils/workoutStorageOperationHelper';

interface ActiveRestCardProps {
  item: ExerciseElement;
  index: number;
}

const ActiveRestCard = ({ item, index }: ActiveRestCardProps) => {
  const { isLargeScreen } = useWebBreakPoints();
  const queryClient = useQueryClient();
  const { updateWorkoutExercises } = useWorkoutDetailStore();
  const { updateExercisePropertyZustand } = useWorkoutSessionStore();
  const { slug } = useLocalSearchParams() as { slug: string; sessionId?: string };
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isWorkoutOwner = useWorkoutSessionStore(state => state.isWorkoutOwner);
  const workoutSessionDetails = useWorkoutSessionStore(state => state.workoutSessionDetails);
  // Use the item.duration as the single source of truth
  const durationValue = item?.duration ?? 0;

  const { mutate: mutateUpdateExerciseToWorkoutRequest } = useMutation({
    mutationFn: updateExerciseToWorkoutRequest,
    onSuccess: async data => {
      queryClient.invalidateQueries({ queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug] });
      updateWorkoutExercises(data?.data?.exercises);
    },
    onError: (error: any) => {
      console.log('error', error);
      // toast.show(error, { type: 'danger' });
    },
    onSettled: () => {
      console.log('onSettled');
    },
  });

  const handlePress = async (newDuration: number) => {
    const hasRest = item?.type === 'rest';
    console.log('Rest exercise-Active-card', { item, hasRest });
    if (hasRest && item?.preExerciseId && item?.preExerciseOrder?.toString()) {
      if (isAuthenticated) {
        // Modify 'reps' based on 'isEnabled'
        const payload = {
          formData: {
            index: item?.preExerciseOrder,
            exercise: {
              rest: newDuration ?? 0,
            },
          },
          queryParams: { id: workoutSessionDetails?.workoutId },
        };
        // console.log('Api call', payload);
        debouncedMutate(mutateUpdateExerciseToWorkoutRequest, payload);
      } else {
        // console.log('Rest exercise-Active-card', { item, hasRest });
        await updateExerciseProperty(slug ?? '', item?.preExerciseId ?? '', 'rest', newDuration);
        updateExercisePropertyOfWorkout(
          workoutSessionDetails?.workoutId ?? '',
          item?.preExerciseId,
          'rest',
          newDuration,
        );
      }

      updateExercisePropertyZustand(item?.preExerciseOrder, 'rest', newDuration);
    }
  };

  const onPressMinusHandler = () => {
    if (durationValue > 0) {
      const newDuration = durationValue - 1;
      handlePress(newDuration);
    }
  };

  const onPressPlusHandler = () => {
    const newDuration = durationValue + 1;
    handlePress(newDuration);
  };

  const renderActionButtons = () => {
    if (isWorkoutOwner) {
      return (
        <>
          <MinusActionButton onPressMinus={onPressMinusHandler} />
          <PlusActionButton onPressPlus={onPressPlusHandler} />
        </>
      );
    }
  };
  return (
    <Container
      style={Platform.select({
        web: [
          {
            height: isLargeScreen ? '133px' : '15.0625rem',
          },
          tailwind(
            ` relative flex-col  justify-center gap-4 rounded-lg bg-NAVBAR_BACKGROUND px-12 py-2 shadow-lg`,
          ),
          webStyles.container,
        ] as any,
        native: [
          tailwind(
            `relative flex-1 flex-col gap-4 rounded-lg bg-NAVBAR_BACKGROUND px-2 ${!isWorkoutOwner ? 'py-4' : 'py-1'} `,
          ),
          webStyles.container,
        ],
      })}>
      <ActiveWorkoutIcon />
      <Container
        style={[
          Platform.select({
            web: [
              { width: isLargeScreen ? '' : '537px' },
              tailwind(
                `mx-auto  flex-col items-center  justify-center ${isLargeScreen ? 'gap-4' : 'gap-12'}`,
              ),
            ] as any,
            native: tailwind('flex-1 flex-col items-center justify-center gap-4'),
          }),
        ]}>
        <Text
          style={[
            Platform.select({
              web: tailwind(
                `${isLargeScreen ? 'line-clamp-1 text-[1rem]' : 'text-[1.625rem] font-bold not-italic'} font-inter`,
              ),
              native: tailwind('flex-1 text-[1rem] font-extrabold'),
            }),
          ]}>
          Rest
        </Text>

        <Container
          style={Platform.select({
            web: tailwind(
              `${isLargeScreen ? 'flex-col gap-4' : 'flex-row gap-12'} items-center justify-center  `,
            ),
            native: tailwind('flex-1 flex-col items-center justify-center gap-4'),
          })}>
          <Container
            style={Platform.select({
              web: tailwind(`${isLargeScreen ? 'gap-[0.75rem]' : 'gap-[4.5rem]'} `),
              native: tailwind('flex-1 gap-[0.75rem]'),
            })}>
            <ShowLabelValue
              label="Duration"
              container={{
                web: `${isLargeScreen ? 'gap-[0.75rem]' : 'gap-[6rem]'} self-center w-auto`,
                native: 'gap-[0.75rem]  ',
              }}
              labelContainer={{
                web: `flex-0`,
                native: 'text-right text-xs',
              }}
              valueContainer={{
                web: ``,
                native: 'text-left text-xs',
              }}
              value={`${durationValue ? `${pluralise(durationValue, `${durationValue} second`)}` : '-'}`}
            />
          </Container>
          <Container
            style={Platform.select({
              web: tailwind(`flex-1 flex-row gap-4`),
              native: tailwind(`${isWorkoutOwner ? 'mb-4' : ''} flex-1 flex-row gap-4`),
            })}>
            {renderActionButtons()}
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

export default ActiveRestCard;

const webStyles = {
  container: {
    backgroundColor: '#252425',
    // height: '100%',
    boxShadow: '0 0 64px 2px rgba(162, 125, 225, 0.6)',
    shadowColor: '#A27DE1', // Shadow color for iOS
    shadowOffset: { width: 0, height: 10 }, // Offset for iOS
    shadowOpacity: 0.6, // Opacity for iOS
    shadowRadius: 16, // Blur radius for iOS
    elevation: 8, // Shadow for Android
  },
};
