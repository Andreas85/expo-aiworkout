import React, { memo } from 'react';
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
import { pluralise } from '@/utils/helper';
import ActiveWorkoutIcon from './ActiveWorkoutIcon';

interface ActiveCardProps {
  item: ExerciseElement;
  onDecrementHandler?: () => void;
  onIncrementHandler?: () => void;
  isExerciseTimeFinished: (
    exerciseDurationTaken: number,
    currentExerciseCompleted: boolean,
  ) => void;
  isRepsWorkoutFinished: (totalElapsedTime: number) => void;
}

const ActiveCard = ({
  item,
  onDecrementHandler,
  onIncrementHandler,
  isExerciseTimeFinished,
  isRepsWorkoutFinished,
}: ActiveCardProps) => {
  const { isLargeScreen } = useWebBreakPoints();

  const renderExerciseImage = () => {
    return (
      <ImageContainer
        source={IMAGES.dummyWorkout}
        styleNative={[
          Platform.select({
            web: tailwind(
              `${isLargeScreen ? 'h-[4.875rem] w-[8.1875rem]' : 'h-[9.9375rem] w-[21.1875rem] shrink-0'} flex-1.5 aspect-video rounded-lg`,
            ),
            native: tailwind('aspect-video flex-1 self-center rounded-lg'),
          }),
        ]}
        contentFit="cover"
        contentPosition={'right top'}
      />
    );
  };

  return (
    <Container
      style={Platform.select({
        web: [
          tailwind(
            `relative flex-1 flex-col gap-4 rounded-lg bg-NAVBAR_BACKGROUND px-12 py-2 shadow-lg`,
          ),
          webStyles.container,
        ] as any,
        native: tailwind('flex-1 flex-col gap-4 rounded-lg bg-NAVBAR_BACKGROUND px-2 py-1'),
      })}>
      <ActiveWorkoutIcon />
      <Container
        style={[
          Platform.select({
            web: [
              { height: '183px' },
              tailwind('flex-row items-center justify-center gap-12'),
            ] as any,
            native: tailwind('flex-row items-center gap-4'),
          }),
        ]}>
        {renderExerciseImage()}
        <Container
          style={[
            Platform.select({
              web: isLargeScreen
                ? tailwind('flex-2 flex flex-col gap-[0.25rem]')
                : tailwind(`flex-2 flex flex-col items-start gap-[1.25rem]`),
              native: tailwind('flex-2 flex flex-col gap-4'),
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
          <ShowLabelValue
            label="No. of Reps"
            value={`${item?.reps ? pluralise(item?.reps, `${item?.reps} second`) : '-'}`}
          />
        </Container>
      </Container>
      <Container style={tailwind('mb-2 items-center justify-center')}>
        <ActionButton
          label="Finish"
          uppercase
          style={[
            Platform.select({
              web: tailwind('mx-auto w-56 cursor-pointer rounded-lg'),
            }),
          ]}
        />
      </Container>
    </Container>
  );
};

export default memo(ActiveCard);

const webStyles = {
  container: {
    backgroundColor: '#252425',
    // height: '100%',
    boxShadow: '0px 12px 24px 4px rgba(95, 63, 102, 0.50)',
  },
};
