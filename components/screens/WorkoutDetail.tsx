import React, { useEffect, useState } from 'react';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import Container from '../atoms/Container';
import TextContainer from '../atoms/TextContainer';
import { router, useNavigation } from 'expo-router';

import { IMAGES } from '@/utils/images';
import ImageContainer from '../atoms/ImageContainer';
import { Platform, Pressable, ScrollView } from 'react-native';
import { tailwind } from '@/utils/tailwind';
import { ExerciseElement } from '@/services/interfaces';
import { ActionButton } from '../atoms/ActionButton';
import { pluralise } from '@/utils/helper';
import { Text } from '../Themed';
import CustomSwitch from '../atoms/CustomSwitch';
import { AntDesign } from '@expo/vector-icons';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';

const WorkoutDetail = () => {
  const navigation = useNavigation();
  const workoutDetail = useWorkoutDetailStore(state => state.workoutDetail);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const { isLargeScreen } = useWebBreakPoints();
  const toggleSwitch = () => setIsEnabled(!isEnabled);

  const renderVersionTab = () => {
    return <CustomSwitch isEnabled={isEnabled} toggleSwitch={toggleSwitch} label="Short Version" />;
  };

  useEffect(() => {
    if (workoutDetail) {
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
        style={tailwind('flex-1 flex-row gap-4 rounded-lg bg-NAVBAR_BACKGROUND p-4')}
        key={item._id}>
        {!isEnabled && (
          <ImageContainer
            source={IMAGES.logo}
            styleNative={[tailwind(`aspect-video h-28 flex-1 self-center rounded-2xl`)]}
            contentFit="fill"
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
    if (workoutDetail?.exercises.length === 0) {
      return (
        <TextContainer
          data="No exercises found"
          style={tailwind('self-center py-20 text-sm font-bold')}
        />
      );
    }
    return (
      <>
        {workoutDetail?.exercises.map((item: ExerciseElement, index: number) => {
          return (
            <Container style={[tailwind('')]} key={item._id}>
              {renderListItem(item, index)}
            </Container>
          );
        })}
      </>
    );
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <Container style={[tailwind(`flex-1  bg-transparent`)]}>
      <Container
        style={[
          Platform.select({
            web: tailwind(`${isLargeScreen ? 'px-32' : 'px-64'}`),
            native: tailwind(''),
          }),
          tailwind('flex-row items-center justify-between p-4'),
        ]}>
        <Pressable style={tailwind('mr-auto')} onPress={handleBackClick}>
          <AntDesign
            name="arrowleft"
            style={tailwind('text-11 rounded-full bg-WORKOUT_VERSION_BACKGROUND')}
            color={'#fff'}
          />
        </Pressable>
        {renderVersionTab()}
      </Container>
      <Container
        style={[
          Platform.select({
            web: tailwind('mx-auto w-3/5'),
            native: tailwind('p-4'),
          }),
          tailwind('flex-1'),
        ]}>
        <TextContainer
          data={`Workout Name: ${workoutDetail?.name}`}
          style={tailwind('self-center pb-4 text-2xl font-bold')}
        />
        <TextContainer data={`Exercises`} style={tailwind(' self-left pb-4 text-lg font-bold')} />
        <Container
          style={[
            Platform.select({
              web: tailwind('mb-16 '),
              native: tailwind('mb-10 '),
            }),
            tailwind('flex-1 pb-8'),
          ]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              rowGap: 20,
            }}>
            {renderWorkoutExercises()}
          </ScrollView>
        </Container>
      </Container>
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
    </Container>
  );
};

export default WorkoutDetail;
