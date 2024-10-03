import React, { useEffect, useState } from 'react';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import Container from '../atoms/Container';
import TextContainer from '../atoms/TextContainer';
import { useNavigation } from 'expo-router';

import { IMAGES } from '@/utils/images';
import ImageContainer from '../atoms/ImageContainer';
import { Platform, ScrollView } from 'react-native';
import { tailwind } from '@/utils/tailwind';
import { ExerciseElement } from '@/services/interfaces';
import { ActionButton } from '../atoms/ActionButton';
import { pluralise } from '@/utils/helper';
import { Text } from '../Themed';
import CustomSwitch from '../atoms/CustomSwitch';

import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import NoDataSvg from '../svgs/NoDataSvg';
import BackActionButton from '../atoms/BackActionButton';
import LabelContainer from '../atoms/LabelContainer';
import { Feather, FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { ICON_SIZE } from '@/utils/appConstants';

const WorkoutDetail = (props: { isPublicWorkout?: boolean }) => {
  const { isPublicWorkout = false } = props;
  const navigation = useNavigation();
  const workoutDetail = useWorkoutDetailStore(state => state.workoutDetail);
  const hasExercise = useWorkoutDetailStore(state => state.hasExercise);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isCurrentWorkoutPublic, setIsCurrentWorkoutPublic] = useState<boolean>(false);
  const { isLargeScreen, isMediumScreen } = useWebBreakPoints();
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

  const renderListItem = (item: ExerciseElement, index: number) => {
    const renderReps = () => {
      if (!!item?.reps) {
        return (
          <>
            <Container style={tailwind('flex-1 flex-row')}>
              <TextContainer data={`No. of reps`} style={tailwind('flex-1')} />
              <TextContainer
                data={`${!!item?.reps ? item?.reps : '-'}`}
                style={tailwind('flex-1')}
              />
            </Container>
            <Container style={tailwind('flex-1 flex-row')}>
              <TextContainer data={`Reps Duration`} style={tailwind('flex-1')} />
              <TextContainer
                data={`${!!item?.reps ? pluralise(item?.duration, `${item?.duration} second`) : '-'}`}
                style={tailwind('flex-1')}
              />
            </Container>
          </>
        );
      } else {
        return (
          <Container style={tailwind('flex-1 flex-row')}>
            <TextContainer data={`Duration`} style={tailwind('flex-1')} />
            <TextContainer
              data={`${!item?.reps ? pluralise(item?.duration, `${item?.duration} second`) : '-'}`}
              style={tailwind('flex-1')}
            />
          </Container>
        );
      }
    };

    const renderRest = () => {
      if (item?.rest) {
        return (
          <Container style={tailwind('flex-1 flex-row')}>
            <TextContainer data={`Rest`} style={tailwind('flex-1')} />
            <TextContainer
              data={`${item?.rest ? pluralise(item?.rest, `${item?.rest} second`) : '-'}`}
              style={tailwind('flex-1')}
            />
          </Container>
        );
      }
    };

    const renderExerciseContainer = () => {
      return (
        <>
          <Text style={tailwind('ftont-bold text-lg font-bold')}>
            {item?.exercise?.name ?? item?.name}
            {item?.weight ? `(${item?.weight} kg)` : ''}
          </Text>
        </>
      );
    };

    return (
      <Container
        style={tailwind('flex-1 flex-row gap-4 rounded-lg bg-NAVBAR_BACKGROUND px-3 py-2')}
        key={item._id}>
        {!isEnabled && (
          <ImageContainer
            source={IMAGES.dummyWorkout}
            styleNative={[tailwind(`aspect-video h-28 flex-1 self-center rounded-lg`)]}
            contentFit="cover"
            contentPosition={'right top'}
          />
        )}
        <Container style={tailwind('flex-1 gap-4')}>
          {renderExerciseContainer()}
          {renderReps()}
          {renderRest()}
        </Container>
      </Container>
    );
  };

  const renderWorkoutExercises = () => {
    if (!hasExercise) {
      return (
        <Container style={tailwind('flex-1')}>
          <NoDataSvg
            label="No exercises "
            message={!isPublicWorkout ? 'Start building your workout' : ''}
          />
        </Container>
      );
    }
    return (
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            rowGap: 20,
          }}>
          {workoutDetail?.exercises.map((item: ExerciseElement, index: number) => {
            return (
              <Container style={[tailwind('')]} key={item._id}>
                {renderListItem(item, index)}
              </Container>
            );
          })}
        </ScrollView>
      </>
    );
  };

  const renderStartWorkoutButton = () => {
    if (hasExercise) {
      return (
        <Container
          style={[
            Platform.select({ web: tailwind('shadow-[0_-4px_10px_4px_rgba(95,63,102,0.50)]') }),
            tailwind('absolute bottom-0 left-0 right-0  flex-1 bg-NAVBAR_BACKGROUND p-4 '),
          ]}>
          <ActionButton
            label="Start workout"
            uppercase
            disabled
            style={[
              Platform.select({
                web: tailwind('mx-auto w-56 cursor-pointer'),
              }),
              tailwind('rounded-lg'),
            ]}
          />
        </Container>
      );
    }
  };

  const renderWorkoutController = () => {
    if (isPublicWorkout) {
      return;
    }
    return (
      <Container
        style={[tailwind('w-full flex-row flex-wrap items-center justify-between gap-4 ')]}>
        <LabelContainer
          label={workoutDetail?.name ?? ''}
          labelStyle={[
            Platform.select({
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
          labelStyle={[tailwind('text-xl font-bold')]}
          label="Public"
        />
        <LabelContainer
          label={'Duplicate'}
          labelStyle={[
            Platform.select({
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
        <TextContainer data={`Exercises`} style={tailwind(' self-left  text-lg font-bold')} />
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
                mx-auto w-4/5
              ${isLargeScreen && 'w-full'}
            `),
            }),
            tailwind('flex-1'),
          ]}>
          {isPublicWorkout && renderExcerciseLabel()}
          <Container
            style={[
              Platform.select({
                web: tailwind('mb-16 '),
                native: tailwind('mb-10 '),
              }),
              tailwind('flex-1 pb-8'),
            ]}>
            {renderWorkoutExercises()}
          </Container>
        </Container>
      </Container>
      {renderStartWorkoutButton()}
    </Container>
  );
};

export default WorkoutDetail;
