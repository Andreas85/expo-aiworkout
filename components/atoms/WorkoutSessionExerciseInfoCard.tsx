import { Platform } from 'react-native';
import React, { useState } from 'react';
import Container from './Container';
import { tailwind } from '@/utils/tailwind';
import TextContainer from './TextContainer';
import { ExerciseElement } from '@/services/interfaces';

import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import WorkoutInput from './WorkoutInput';

const WorkoutSessionExerciseInfoCard = (props: { item: ExerciseElement }) => {
  const { item } = props;
  const { isMediumScreen } = useWebBreakPoints();
  const [inputValues] = useState({
    weight: item?.weight ? item?.weight + '' : '0',
    rest: item?.rest ? item?.rest + '' : '0',
    reps: item?.reps ? item?.reps + '' : '0',
    duration: item?.duration ? item?.duration + '' : '0',
    durationTaken: item?.durationTaken ? item?.durationTaken + '' : '0',
  });

  const renderWorkoutSessionExerciseData = () => {
    return (
      <Container
        style={Platform.select({
          web: tailwind('flex-row items-center justify-between gap-4'),
          native: tailwind('flex-row gap-4'),
        })}>
        <WorkoutInput
          workoutInputLabel={`Weight ${isMediumScreen ? '(kg)' : '(in kg)'}`}
          workoutInputInitialValue={{ weight: `0/${inputValues.weight}` }}
          disableAppTextInput={true}
        />
        <WorkoutInput
          workoutInputLabel="Reps"
          workoutInputInitialValue={{ weight: `${inputValues.reps}/${inputValues.reps}` }}
          disableAppTextInput={true}
        />
        <WorkoutInput
          workoutInputLabel={`Duration ${isMediumScreen ? '(sec)' : '(in seconds)'}`}
          workoutInputInitialValue={{
            weight: `${inputValues.durationTaken}/${inputValues.duration}`,
          }}
          disableAppTextInput={true}
        />
      </Container>
    );
  };

  return (
    <>
      <Container
        style={[
          Platform.select({
            web: tailwind(
              `relative h-full w-full grow cursor-pointer ${isMediumScreen ? 'flex-col' : 'flex-row justify-between'}  gap-2 self-center rounded-lg bg-NAVBAR_BACKGROUND  p-4`,
            ),
            native: tailwind(`flex-col gap-2 rounded-lg bg-NAVBAR_BACKGROUND  p-4`),
          }),
        ]}>
        {/* Workout Details */}
        <Container
          style={Platform.select({
            web: tailwind(`${isMediumScreen ? '' : 'w-[21.0625rem] flex-none'} `),
          })}>
          <TextContainer
            data={item?.name || 'Workout Name'}
            style={[
              Platform.select({
                web: tailwind(
                  `${isMediumScreen ? 'text-center text-[0.9375rem]' : 'text-lg'} flex-none `,
                ),
                native: tailwind('text-center text-[0.9375rem]'),
              }),
            ]}
          />
        </Container>

        <Container
          style={Platform.select({
            web: tailwind('flex-1 gap-2'),
          })}>
          {renderWorkoutSessionExerciseData()}
        </Container>
      </Container>
    </>
  );
};

export default WorkoutSessionExerciseInfoCard;
