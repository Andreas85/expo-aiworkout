import React, { useCallback, useEffect, useState } from 'react';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import Container from '../atoms/Container';
import TextContainer from '../atoms/TextContainer';
import { useNavigation } from 'expo-router';

import { LayoutAnimation, Platform, RefreshControl, ScrollView } from 'react-native';
import { tailwind } from '@/utils/tailwind';
import { ExerciseElement } from '@/services/interfaces';
import { ActionButton } from '../atoms/ActionButton';
import CustomSwitch from '../atoms/CustomSwitch';

import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import NoDataSvg from '../svgs/NoDataSvg';
import BackActionButton from '../atoms/BackActionButton';
import LabelContainer from '../atoms/LabelContainer';
import WorkoutCard from '../atoms/WorkoutCard';
import { useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';
import { pluralise } from '@/utils/helper';
import { Text } from '../Themed';

const PublicWorkoutDetail = (props: { isPublicWorkout?: boolean }) => {
  const { isPublicWorkout = false } = props;
  const navigation = useNavigation();
  const workoutDetail = useWorkoutDetailStore(state => state.workoutDetail);
  const hasExercise = useWorkoutDetailStore(state => state.hasExercise);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const { isLargeScreen, isMediumScreen } = useWebBreakPoints();
  const toggleSwitch = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsEnabled(prev => !prev);
  }, []);
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onRefresh = async () => {
    // Start the refreshing animation
    try {
      // Do the refresh
      setRefreshing(true);
      await queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT],
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      setRefreshing(false);
    }
  };
  const renderVersionTab = () => {
    if (hasExercise) {
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
      navigation.setOptions({ title: `Workout: ${workoutDetail.name ?? ''}`, unmountOnBlur: true });
    }
  }, [workoutDetail]);

  const renderListItem = (item: ExerciseElement, index: number) => {
    return <WorkoutCard key={item?._id} item={item} isEnabled={isEnabled} />;
  };

  const renderExerciseItem = (item: ExerciseElement) => {
    return (
      <Container
        style={[
          Platform.select({
            web: tailwind(`flex-1 ${isLargeScreen ? 'py-[0.25rem]' : 'py-3'}  `),
            native: tailwind('flex-1 py-[0.25rem]'),
          }),
        ]}
        key={item._id}>
        <Container
          style={[
            Platform.select({
              web: tailwind(`${isLargeScreen ? 'py-1' : 'py-2 pb-3'}`),
              native: tailwind('justify-between gap-3 py-1  '),
            }),
            tailwind('flex-1 flex-row items-start '),
          ]}>
          <Text
            style={[
              Platform.select({
                web: tailwind(
                  `${isLargeScreen ? 'w-[47%] text-[0.875rem]' : 'w-[56%] text-[1.375rem]'} ps-[2px]`,
                ),
                native: tailwind('w-[47%] text-[0.875rem]'),
              }),
            ]}
            numberOfLines={1}>
            {item?.exercise?.name ?? item?.name}
            {item?.weight ? ` (${item?.weight} kg)` : ''}
          </Text>
          <TextContainer
            data={`${item?.reps ? item?.reps : '-'}`}
            style={[
              Platform.select({
                web: tailwind(
                  `${isLargeScreen ? 'w-[32%] px-4 text-[0.875rem] ' : 'w-[24%] text-[1.375rem]'}`,
                ),
                native: tailwind('w-[27%] text-[0.875rem]'),
              }),
            ]}
          />
          <TextContainer
            data={`${item?.rest ? pluralise(item?.rest, `${item?.rest} second`) : '-'}`}
            style={[
              Platform.select({
                web: tailwind(`${isLargeScreen ? 'w-[30%] text-[0.875rem]' : 'text-[1.375rem]'}`),
                native: tailwind('w-[30%] text-[0.875rem]'),
              }),
            ]}
          />
        </Container>
        <Container
          style={[
            Platform.select({
              web: tailwind('border-b-[0.1px] opacity-10'),
              native: tailwind('border-[0.25px] opacity-25'),
            }),
            tailwind('border-none border-white '),
          ]}
        />
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
    if (isEnabled) {
      return (
        <ScrollView
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#ff0000" // iOS specific
              colors={['#ff0000', '#00ff00', '#0000ff']} // Android specific
            />
          }
          contentContainerStyle={{
            rowGap: 0,
            borderRadius: isLargeScreen ? 10 : 5,
            backgroundColor: '#252425',
          }}>
          <Container
            style={[
              Platform.select({
                web: tailwind(
                  ` ${isLargeScreen ? 'justify-between1 rounded-lg px-3 py-2' : ' px-[2.5rem] py-5'}  `,
                ),
                native: tailwind(' justify-between  rounded-lg px-3 py-2'),
              }),
              tailwind('flex-row  '),
            ]}>
            <TextContainer
              data={'Exercises'}
              style={[
                Platform.select({
                  web: tailwind(
                    ` ${isLargeScreen ? 'w-[47%]  text-[0.875rem] font-bold' : 'w-[56%] text-[1.5rem]'}   `,
                  ),
                  native: tailwind(' w-[47%] text-[0.875rem]  font-bold'),
                }),
              ]}
              numberOfLines={1}
            />
            <TextContainer
              data={'No. of Reps'}
              style={[
                Platform.select({
                  web: tailwind(
                    ` ${isLargeScreen ? 'w-[27%] text-[0.875rem] font-bold' : 'w-[24%] text-[1.5rem]'}  `,
                  ),
                  native: tailwind('w-[27%]  text-[0.875rem]  font-bold'),
                }),
              ]}
              numberOfLines={1}
            />
            <TextContainer
              data={'Rest'}
              style={[
                Platform.select({
                  web: tailwind(
                    `${isLargeScreen ? 'w-[30%] text-[0.875rem] font-bold ' : ' text-[1.5rem]'} `,
                  ),
                  native: tailwind('w-[30%]  text-center  text-[0.875rem] font-bold '),
                }),
              ]}
              numberOfLines={1}
            />
          </Container>
          {!isLargeScreen && (
            <Container
              style={[
                Platform.select({
                  web: tailwind('border-b-[0.1px] opacity-10'),
                  native: tailwind('border-[0.25px] opacity-25'),
                }),
                tailwind('border-none border-white '),
              ]}
            />
          )}
          <Container
            style={[
              Platform.select({
                web: tailwind(
                  `flex-1 flex-col gap-4 ${isLargeScreen ? 'rounded-lg px-3 py-2 ' : 'px-[2.5rem] py-[1.25rem]'}  `,
                ),
                native: tailwind('flex-1 flex-col gap-4 rounded-lg  px-3 py-2'),
              }),
            ]}>
            <Container style={tailwind('flex-1 ')}>
              {workoutDetail?.exercises.map(renderExerciseItem)}
            </Container>
          </Container>
        </ScrollView>
      );
    }

    return (
      <>
        <ScrollView
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#ff0000" // iOS specific
              colors={['#ff0000', '#00ff00', '#0000ff']} // Android specific
            />
          }
          contentContainerStyle={[
            Platform.select({
              web: tailwind(`${isLargeScreen ? 'gap-[0.5rem]' : 'gap-[1.25rem]'} `),
              native: {
                rowGap: 10,
              },
            }),
          ]}>
          {workoutDetail?.exercises.map((item: ExerciseElement, index: number) => {
            return (
              <Container style={[tailwind('flex-1')]} key={item._id}>
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
            Platform.select({
              web: [
                tailwind(
                  'absolute bottom-0 left-0 right-0 mx-auto flex-1   bg-NAVBAR_BACKGROUND p-4 shadow-[0_-4px_10px_4px_rgba(95,63,102,0.50)]',
                ),
                isLargeScreen
                  ? styles.MOBILE.START_BUTTON_CONTAINER
                  : styles.DESKTOP.START_BUTTON_CONTAINER,
              ],
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
                // web: tailwind('mx-auto w-56 cursor-pointer'),
                web: isLargeScreen ? styles.MOBILE.START_BUTTON : styles.DESKTOP.START_BUTTON,
                native: tailwind('rounded-lg'),
              }),
            ]}
          />
        </Container>
      );
    }
  };

  const renderExcerciseLabel = () => {
    if (!isEnabled) {
      return (
        <>
          <TextContainer
            data={`Exercises`}
            style={[
              Platform.select({
                web: isLargeScreen
                  ? tailwind('self-left text-[1rem]')
                  : styles.DESKTOP.EXERCISES_TITLE,
                native: tailwind(' self-left  text-[1rem] font-bold'),
              }),
            ]}
          />
          <Container style={[tailwind(`mb-4 `)]} />
        </>
      );
    }
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
          </Container>
          {!isMediumScreen && renderVersionTab()}
        </Container>
        {!isLargeScreen && (
          <TextContainer
            data={workoutDetail?.name}
            style={[
              Platform.select({
                web: styles.DESKTOP.TITLE,
                native: tailwind(
                  ' mb-4  self-center text-center text-[2rem] font-bold not-italic leading-[150%]',
                ),
              }),
            ]}
            numberOfLines={1}
          />
        )}

        {isMediumScreen && renderVersionTab()}

        <Container
          style={[
            Platform.select({
              web: tailwind(`
                mx-auto 
              ${isLargeScreen ? 'w-full' : 'h-[12.4375rem] w-[56rem]'}
            `),
            }),
            tailwind('flex-1'),
          ]}>
          {renderExcerciseLabel()}
          <Container
            style={[
              Platform.select({
                web: tailwind(isLargeScreen ? 'mb-16' : 'mb-24 '),
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

export default PublicWorkoutDetail;

const styles = {
  MOBILE: {
    START_BUTTON_CONTAINER: {
      height: '92px',
      flexShrink: '0',
      boxShadow: '0px -12px 24px 4px rgba(95, 63, 102, 0.50)',
      displex: 'flex',
      justifyContent: 'center',
    },
    START_BUTTON: {
      display: 'flex',
      height: 44,
      paddingTop: 12,
      paddingRight: 10,
      paddingBottom: 12,
      paddingLeft: 10,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
      flexShrink: 0,
      alignSelf: 'stretch',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
      borderBottomLeftRadius: 8,
    },
  },
  DESKTOP: {
    TITLE: {
      color: '#FFF',
      textAlign: 'center',
      fontSize: '32px',
      fontStyle: 'normal',
      fontWeight: '700',
      lineHeight: '150%',
      paddingBottom: '15px',
    },
    EXERCISES_TITLE: {
      color: '#FFF',
      textAlign: 'left',
      fontSize: '32px',
      fontStyle: 'normal',
      fontWeight: '700',
      lineHeight: '150%',
    },
    START_BUTTON: {
      display: 'flex',
      width: '23.0625rem',
      height: '3.6875rem',
      paddingTop: '0.75rem',
      paddingRight: '0.625rem',
      paddingBottom: '0.75rem',
      paddingLeft: '0.625rem',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.625rem',
      flexShrink: 0,
      borderTopLeftRadius: '1rem',
      borderTopRightRadius: '1rem',
      borderBottomRightRadius: '1rem',
      borderBottomLeftRadius: '1rem',
    },
    START_BUTTON_CONTAINER: {
      display: 'flex',
      height: '7.5rem',
      paddingTop: '1.9375rem',
      paddingRight: '0rem',
      paddingBottom: '1.875rem',
      paddingLeft: '0rem',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
      boxShadow: '0px -12px 24px 4px rgba(95, 63, 102, 0.50)',
    },
  },
};
