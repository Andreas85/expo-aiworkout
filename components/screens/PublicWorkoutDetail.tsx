import React, { useCallback, useEffect, useState } from 'react';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import Container from '../atoms/Container';
import TextContainer from '../atoms/TextContainer';
import { useNavigation } from 'expo-router';

import { LayoutAnimation, Platform } from 'react-native';
import { tailwind } from '@/utils/tailwind';
import { ActionButton } from '../atoms/ActionButton';
import CustomSwitch from '../atoms/CustomSwitch';

import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import NoDataSvg from '../svgs/NoDataSvg';
import BackActionButton from '../atoms/BackActionButton';
import LabelContainer from '../atoms/LabelContainer';

import { useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';

import PublicWorkoutExercisesRender from '../molecules/PublicWorkoutExercisesRender';
import useWorkoutSessionDetailsTracking from '@/hooks/useWorkoutSessionDetails';

const PublicWorkoutDetail = (props: { isPublicWorkout?: boolean }) => {
  const { isPublicWorkout = false } = props;
  const navigation = useNavigation();

  const workoutDetail = useWorkoutDetailStore(state => state.workoutDetail);
  const hasExercise = useWorkoutDetailStore(state => state.hasExercise);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const { handleAddWorkoutSession } = useWorkoutSessionDetailsTracking();
  const { isLargeScreen, isMediumScreen } = useWebBreakPoints();
  const [loading, setLoading] = useState(false);

  const toggleSwitch = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsEnabled(prevState => !prevState);
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
        <PublicWorkoutExercisesRender
          data={workoutDetail?.exercises}
          isEnabled={isEnabled}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      </>
    );
  };

  const handleStartWorkoutClick = () => {
    handleAddWorkoutSession({ setLoading });
  };

  const renderStartWorkoutButton = () => {
    if (hasExercise) {
      return (
        <Container
          style={[
            Platform.select({
              web: tailwind('absolute bottom-0 left-0 right-0  items-center p-4'),

              native: tailwind(
                'absolute bottom-0 left-0 right-0  flex-1 bg-NAVBAR_BACKGROUND p-4 ',
              ),
            }),
          ]}>
          <ActionButton
            label="Start workout"
            uppercase
            isLoading={loading}
            // disabled
            onPress={handleStartWorkoutClick}
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
                web: tailwind(`${isLargeScreen ? 'mb-16' : ' '} flex-1 `),
                native: tailwind('mb-10 flex-1 pb-8'),
              }),
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
