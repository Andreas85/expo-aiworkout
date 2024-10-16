import React, { useEffect, useState } from 'react';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import Container from '../atoms/Container';
import TextContainer from '../atoms/TextContainer';
import { useNavigation } from 'expo-router';

import { Platform } from 'react-native';
import { tailwind } from '@/utils/tailwind';
import { ActionButton } from '../atoms/ActionButton';

import CustomSwitch from '../atoms/CustomSwitch';

import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import NoDataSvg from '../svgs/NoDataSvg';
import BackActionButton from '../atoms/BackActionButton';
import LabelContainer from '../atoms/LabelContainer';
import { Feather, FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { ICON_SIZE } from '@/utils/appConstants';
import DraggableExercises from '../molecules/DraggableExercises';
import AppTextSingleInput from '../atoms/AppTextSingleInput';

const WorkoutDetail = (props: { isPublicWorkout?: boolean }) => {
  const { isPublicWorkout = false } = props;
  const navigation = useNavigation();
  const workoutDetail = useWorkoutDetailStore(state => state.workoutDetail);
  const hasExercise = useWorkoutDetailStore(state => state.hasExercise);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isCurrentWorkoutPublic, setIsCurrentWorkoutPublic] = useState<boolean>(false);
  const { isLargeScreen, isMediumScreen, isMobileDeviceOnly } = useWebBreakPoints();
  const toggleSwitch = () => setIsEnabled(!isEnabled);
  const toggleIsCurrentWorkoutPublic = () => setIsCurrentWorkoutPublic(!isCurrentWorkoutPublic);

  const renderVersionTab = () => {
    if (hasExercise && isPublicWorkout) {
      return (
        <CustomSwitch
          isEnabled={isEnabled}
          toggleSwitch={toggleSwitch}
          label="Short Version"
          containerStyle={[tailwind('my-0 ')]}
        />
      );
    }
  };

  useEffect(() => {
    if (workoutDetail) {
      setIsCurrentWorkoutPublic(workoutDetail?.isPublic);
      navigation.setOptions({ title: `Workout: ${workoutDetail.name ?? ''}`, unmountOnBlur: true });
    }
  }, [workoutDetail]);

  const renderWorkoutExercises = () => {
    if (!hasExercise) {
      return (
        <Container style={tailwind('flex-1')}>
          <NoDataSvg
            label="No exercises (Coming Soon)"
            message={!isPublicWorkout ? 'Start building your workout' : ''}
          />
        </Container>
      );
    }
    return (
      <>
        <DraggableExercises />
      </>
    );
  };

  const renderStartWorkoutButton = () => {
    if (hasExercise) {
      return (
        <Container
          style={[
            Platform.select({
              web: tailwind(
                'absolute bottom-3 left-0 right-0 mx-auto flex-1  items-center justify-center self-center',
              ),

              native: tailwind(
                'absolute bottom-0 left-0 right-0  flex-1 bg-NAVBAR_BACKGROUND p-4 ',
              ),
            }),
          ]}>
          <ActionButton
            label="Start workout"
            uppercase
            disabled
            style={[
              Platform.select({
                web: tailwind(
                  `${isLargeScreen ? 'w-full' : 'h-[3.6875rem] w-[23.0625rem]'} flex  shrink-0 items-center justify-center gap-2.5 rounded-lg px-2.5 py-3`,
                ),
                native: tailwind('rounded-lg'),
              }),
            ]}
          />
        </Container>
      );
    }
  };

  const renderWorkoutController = () => {
    return (
      <Container
        style={[tailwind('w-full flex-row flex-wrap items-center justify-between gap-4 ')]}>
        <LabelContainer
          label={workoutDetail?.name ?? ''}
          labelStyle={[
            Platform.select({
              web: tailwind(
                `${isLargeScreen ? 'text-[1.0625rem]' : 'text-[1.5rem]'} text-center font-bold  not-italic leading-[150%] text-white `,
              ),
              native: tailwind('text-xl font-bold'),
            }),
          ]}
          containerStyle={[
            Platform.select({
              web: tailwind(`
                ${isLargeScreen ? 'hidden' : 'text-xl font-bold'}  
              `),
              native: tailwind('hidden'),
            }),
          ]}
          left={<FontAwesome5 name="edit" color="#A27DE1" size={ICON_SIZE} />}
        />
        <CustomSwitch
          isEnabled={isCurrentWorkoutPublic}
          toggleSwitch={toggleIsCurrentWorkoutPublic}
          labelStyle={[
            Platform.select({
              web: tailwind(
                ' text-center text-xl font-normal not-italic leading-[150%] text-white',
              ),
              native: tailwind('text-xl font-bold'),
            }),
          ]}
          label="Public"
        />
        <LabelContainer
          label={'Duplicate'}
          labelStyle={[
            Platform.select({
              web: tailwind(
                ` ${isLargeScreen ? 'text-[0.8125rem]' : 'text-xl'} text-center font-normal  not-italic leading-[150%] text-white`,
              ),
              native: tailwind('text-xl font-bold'),
            }),
          ]}
          containerStyle={[
            Platform.select({
              web: tailwind(''),
              // native: tailwind('flex-1'),
            }),
          ]}
          left={<Ionicons name="duplicate-sharp" color="#A27DE1" size={ICON_SIZE} />}
        />
        <LabelContainer
          label={'Delete'}
          labelStyle={[
            Platform.select({
              web: tailwind(
                ` ${isLargeScreen ? 'text-[0.8125rem]' : 'text-xl'} text-center font-normal  not-italic leading-[150%] text-white`,
              ),
              native: tailwind('text-xl font-bold'),
            }),
          ]}
          containerStyle={[
            Platform.select({
              web: tailwind(''),
              // native: tailwind('flex-1'),
            }),
          ]}
          left={<FontAwesome6 name="trash-can" color="#A27DE1" size={ICON_SIZE} />}
        />
      </Container>
    );
  };

  const renderExcerciseLabel = () => {
    return (
      <>
        <TextContainer
          data={`Exercises`}
          style={Platform.select({
            web: tailwind(
              `${isLargeScreen ? 'text-base' : 'text-2xl'}  font-bold capitalize not-italic leading-[150%] text-white`,
            ),
            native: tailwind(' self-left  text-lg font-bold'),
          })}
        />
        <Container
          style={[tailwind(`mb-4 ${isPublicWorkout ? '' : 'border-[0.35px] border-white'} `)]}
        />
      </>
    );
  };

  return (
    <Container style={[tailwind(`flex-1  bg-transparent`)]}>
      <Container
        style={[
          Platform.select({
            web: tailwind(`mx-auto flex w-full flex-col gap-2 px-32
                ${isLargeScreen && 'px-4'}
              `),
            native: tailwind('flex flex-col gap-4 p-4'),
          }),
          tailwind('flex-1'),
        ]}>
        <Container
          style={[
            Platform.select({
              web: tailwind(` pt-4`),
              native: tailwind('space-y-4'),
            }),
            tailwind('flex-row items-center justify-between'),
          ]}>
          <Container style={[tailwind('flex-1 flex-row flex-wrap items-center gap-2')]}>
            <BackActionButton />
            <LabelContainer
              label={workoutDetail?.name ?? ''}
              labelStyle={[
                Platform.select({
                  web: tailwind(
                    `${isLargeScreen ? 'text-[1.0625rem]' : 'text-[1.5rem]'} text-center font-bold  not-italic leading-[150%] text-white `,
                  ),
                  native: tailwind('text-xl font-bold'),
                }),
              ]}
              containerStyle={[
                Platform.select({
                  web: tailwind(`
                    ${isLargeScreen ? 'flex-1 justify-between' : 'hidden'}  
                  `),
                  native: tailwind('flex-1 justify-between'),
                }),
              ]}
              left={isPublicWorkout ? '' : <Feather name="edit" color="#A27DE1" size={ICON_SIZE} />}
            />
          </Container>
          {!isMediumScreen && renderVersionTab()}
        </Container>

        {renderWorkoutController()}
        {isPublicWorkout && isMediumScreen && renderVersionTab()}
        {isPublicWorkout && (
          <TextContainer
            data={`Workout Name: ${workoutDetail?.name}`}
            style={[
              Platform.select({
                web: tailwind('self-center py-4 text-2xl font-bold'),
                native: tailwind('hidden'),
              }),
            ]}
          />
        )}
        {!isPublicWorkout && renderExcerciseLabel()}
        <Container
          style={[
            Platform.select({
              web: tailwind(`
                mx-auto w-full
            `),
            }),
            tailwind('flex-1'),
          ]}>
          <Container
            style={[
              Platform.select({
                web: tailwind('mb-16'),
                native: tailwind('mb-10 '),
              }),
              tailwind('flex-1 pb-8'),
            ]}>
            <Container
              style={[
                Platform.select({
                  web: tailwind(
                    `mx-auto flex w-[44.875rem] flex-col items-start gap-2 ${isLargeScreen && 'w-full'}`,
                  ),
                  native: tailwind(`mx-auto w-full items-start gap-2 `),
                }),
              ]}>
              <AppTextSingleInput
                initialValues={{ exercise: '' }}
                placeholder="Search exercise name"
                fieldName={''}
                handleSubmit={() => {}}
                containerStyleAppTextInput={[
                  Platform.select({
                    web: tailwind(
                      `w-full border border-white  ${isMobileDeviceOnly ? 'bg-[#42382E]' : 'bg-[#41474A]'} px-5`,
                    ),
                    native: tailwind(`w-full border  border-white  bg-[#42382E]  px-5`),
                  }),
                ]}
                testInputStyle={[
                  Platform.select({
                    web: tailwind(' py-4 text-left text-base font-normal'),
                    // native: tailwind('h-20 flex-1 py-4 text-left text-base font-normal'),
                  }),
                ]}
                autoCapitalize="none"
                placeholderTextColor="#fff"
                right={<Ionicons name="search" color="#fff" size={ICON_SIZE} />}
              />
            </Container>
            {renderWorkoutExercises()}
          </Container>
        </Container>
      </Container>
      {renderStartWorkoutButton()}
    </Container>
  );
};

export default WorkoutDetail;
