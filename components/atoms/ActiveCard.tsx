import React from 'react';
import { Platform } from 'react-native';
import Container from './Container';
import ImageContainer from './ImageContainer';
import { tailwind } from '@/utils/tailwind';
import ShowLabelValue from './ShowLabelValue';
import { ExerciseElement } from '@/services/interfaces';
import { Text } from '../Themed';
import { IMAGES } from '@/utils/images';
import { ActionButton } from './ActionButton';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import ActiveWorkoutIcon from './ActiveWorkoutIcon';
import MinusActionButton from './MinusActionButton';
import PlusActionButton from './PlusActionButton';
import { pluralise } from '@/utils/helper';
import { updateExerciseProperty } from '@/utils/workoutSessionHelper';
import { useLocalSearchParams } from 'expo-router';
import { useWorkoutSessionStore } from '@/store/workoutSessiondetail';

interface ActiveCardProps {
  item: ExerciseElement;
  index: number;
  handleFinish?: () => void;
}

const ActiveCard = ({ item, handleFinish }: ActiveCardProps) => {
  const { isLargeScreen } = useWebBreakPoints();
  const { slug } = useLocalSearchParams() as { slug: string; sessionId?: string };
  const isWorkoutTimerRunning = useWorkoutSessionStore(state => state.isWorkoutTimerRunning);
  const { updateExercisePropertyZustand } = useWorkoutSessionStore();

  const hasReps = !!item?.reps;
  const repsValue = item?.reps ?? 0;
  const durationValue = item?.duration ?? 0;

  const handlePress = async (newDuration: number) => {
    // console.log('Normal exercise-Active-card', { item });
    await updateExerciseProperty(slug ?? '', item?._id ?? '', 'reps', newDuration);
    updateExercisePropertyZustand(item.order, 'reps', newDuration);
  };

  const onPressMinusHandler = async () => {
    if (item.reps && item.reps > 0) {
      if (repsValue > 0) {
        const newDuration = repsValue - 1;
        handlePress(newDuration);
      }
    } else {
      console.log(`Cannot decrement: No reps or reps already at 0 for ${item.name ?? 'exercise'}`);
    }
  };

  const onPressPlusHandler = () => {
    if (item.reps !== undefined) {
      const newDuration = repsValue + 1;
      handlePress(newDuration);
    } else {
      console.log(`Cannot increment: No reps defined for ${item.name ?? 'exercise'}`);
    }
    // onIncrementHandler?.(item.reps + 1);
  };

  const renderActionButtons = () => {
    if (hasReps) {
      return (
        <>
          <MinusActionButton onPressMinus={onPressMinusHandler} />
          <PlusActionButton onPressPlus={onPressPlusHandler} />
        </>
      );
    }
  };

  const renderExerciseInfo = () => {
    return (
      <Container
        style={Platform.select({
          web: tailwind(
            `flex-1 ${isLargeScreen ? '' : 'gap-12'} flex-row  items-center justify-center  `,
          ),
          native: tailwind('flex-1 flex-row items-center justify-center self-center '),
        })}>
        <Container
          style={Platform.select({
            web: tailwind(`flex-1 items-center justify-center gap-[0.75rem]`),
            native: tailwind(
              `${hasReps ? 'flex-1' : 'flex-1.2'} self-center'  items-center justify-start gap-[0.75rem]`,
            ),
          })}>
          <ShowLabelValue
            label={hasReps ? 'No. of Reps ' : 'Duration'}
            value={
              hasReps
                ? `${repsValue}`
                : `${durationValue ? `${pluralise(durationValue, `${durationValue} second`)}` : '-'}`
            }
            container={{
              web: `  flex-1  items-start justify-center `,
              native: '  flex-none self-stretch bg-g1reen-600 items-start justify-center',
            }}
            labelContainer={{
              web: `flex-1`,
              native: '',
            }}
            valueContainer={{
              web: `flex-1 text-[0.8175rem]`,
              native: ' ',
            }}
            // noOfLinesValue={1}
          />
        </Container>
        <Container
          style={Platform.select({
            web: tailwind(`flex-1 flex-row  justify-between gap-4`),
            native: tailwind('flex-1 flex-row items-center justify-between gap-4 self-center'),
          })}>
          {renderActionButtons()}
        </Container>
      </Container>
    );
  };

  const renderExerciseImage = () => {
    return (
      <ImageContainer
        source={IMAGES.dummyWorkout}
        styleNative={[
          Platform.select({
            web: tailwind(
              `${isLargeScreen ? 'h-[5.625rem] w-[9.6875rem]' : 'h-[9.9375rem] w-[21.1875rem] shrink-0'} aspect-video flex-1 rounded-lg`,
            ),
            native: tailwind('aspect-video flex-1 self-center rounded-lg'),
          }),
        ]}
        contentFit="cover"
        contentPosition={'right top'}
      />
    );
  };

  const handleFinishClick = () => {
    handleFinish?.();
  };

  const renderFinishButton = () => {
    if (hasReps) {
      return (
        <ActionButton
          label="Finish"
          onPress={handleFinishClick}
          uppercase
          disabled={!isWorkoutTimerRunning}
          style={[
            Platform.select({
              web: tailwind(
                `mx-auto ${isLargeScreen ? 'w-[8.75rem]' : 'w-[23.0625rem]'} cursor-pointer rounded-lg`,
              ),
            }),
          ]}
        />
      );
    }
  };

  return (
    <Container
      style={Platform.select({
        web: [
          tailwind(
            `relative flex-col gap-4 rounded-lg bg-NAVBAR_BACKGROUND ${isLargeScreen ? 'p-4' : 'px-12 py-2'} shadow-lg`,
          ),
          webStyles.container,
        ] as any,
        native: [
          tailwind('flex-1 flex-col gap-4 rounded-lg bg-NAVBAR_BACKGROUND px-2 py-1'),
          webStyles.container, // Apply native shadow styles here,
        ],
      })}>
      <ActiveWorkoutIcon />
      <Container
        style={[
          Platform.select({
            web: [
              { height: isLargeScreen ? '' : '183px' },
              tailwind(`flex-row items-end justify-center ${isLargeScreen ? 'gap-4' : ' gap-12'}`),
            ] as any,
            native: tailwind('flex-row items-end gap-4'),
          }),
        ]}>
        {renderExerciseImage()}
        <Container
          style={[
            Platform.select({
              web: isLargeScreen
                ? tailwind('flex flex-1 flex-col gap-[0.25rem]')
                : tailwind(`flex flex-1 flex-col items-start gap-[1.25rem]`),
              native: tailwind('flex flex-1 flex-col gap-4'),
            }),
          ]}>
          <Text
            style={[
              Platform.select({
                web: tailwind(
                  `${isLargeScreen ? 'line-clamp-1 text-[1rem]' : 'text-[1.625rem] font-bold not-italic'} font-inter`,
                ),
                native: tailwind('text-[1rem] font-extrabold'),
              }),
              {
                fontWeight: '700',
              },
            ]}>
            {`${item?.exercise?.name || item?.name}${item?.weight ? ` (${item?.weight} kg)` : ''} `}
          </Text>

          <Container
            style={Platform.select({
              web: tailwind(
                `${isLargeScreen ? 'hidden flex-col gap-4' : 'flex-row '} w-full items-center justify-center `,
              ),
              native: tailwind('hidden w-3/5 flex-col items-center justify-center gap-4'),
            })}>
            <Container
              style={Platform.select({
                web: tailwind(`${isLargeScreen ? 'gap-[0.75rem]' : 'gap-[4.5rem]'} w-full `),
                native: tailwind('flex-1 gap-[0.75rem]'),
              })}>
              <ShowLabelValue
                label={hasReps ? 'No. of Reps ' : 'Duration'}
                value={
                  hasReps
                    ? `${repsValue}`
                    : `${durationValue ? `${pluralise(durationValue, `${durationValue} second`)}` : ''}`
                }
                container={{
                  web: `${isLargeScreen ? 'gap-[0.75rem]' : 'gap-[rem]'} self-center w-full `,
                  native: 'gap-[0.75rem]  ',
                }}
                labelContainer={{
                  web: `flex-1`,
                  native: 'text-center',
                }}
                valueContainer={{
                  web: `flex-1`,
                  native: 'text-center',
                }}
              />
            </Container>
            <Container
              style={Platform.select({
                web: tailwind(`flex-1 flex-row justify-end gap-4`),
                native: tailwind('mb-4 flex-1 flex-row  gap-4'),
              })}>
              {renderActionButtons()}
            </Container>
          </Container>
        </Container>
      </Container>
      {isLargeScreen && renderExerciseInfo()}
      <Container style={tailwind('mb-2 items-center justify-center')}>
        {renderFinishButton()}
      </Container>
    </Container>
  );
};

export default ActiveCard;

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
