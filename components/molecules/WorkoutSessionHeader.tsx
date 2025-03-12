import React from 'react';
import { Platform } from 'react-native';
import Container from '../atoms/Container';
import { tailwind } from '@/utils/tailwind';
import BackActionButton from '../atoms/BackActionButton';
import LabelContainer from '../atoms/LabelContainer';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { useWorkoutSessionStore } from '@/store/workoutSessiondetail';
import { ActionButton } from '../atoms/ActionButton';
import WorkoutSessionStatusWithIcon from '../atoms/WorkoutSessionStatusWithIcon';
import { navigateToWorkoutDetail } from '@/utils/helper';

const WorkoutSessionHeader = () => {
  const { isLargeScreen, isMediumScreen } = useWebBreakPoints();
  const workoutDetail = useWorkoutSessionStore(state => state.workoutSessionDetails);
  const isWorkoutOwner = useWorkoutSessionStore(state => state.isWorkoutOwner) ?? false;

  const handleGoToWorkoutClick = () => {
    if (typeof workoutDetail === 'object' && workoutDetail !== null) {
      navigateToWorkoutDetail(isWorkoutOwner, workoutDetail.workoutId ?? '');
    }
  };

  const renderRightSection = () => {
    if (isMediumScreen) {
      return (
        <>
          <Container
            style={Platform.select({
              web: tailwind(
                `flex-1 flex-row items-center justify-between gap-4 ${isMediumScreen ? ' w-full' : ''}`,
              ),
              native: tailwind(` w-full flex-row items-center justify-between gap-4`),
            })}>
            <WorkoutSessionStatusWithIcon
              itemStatus={workoutDetail?.status?.toUpperCase() as 'FINISHED' | 'PENDING'}
            />
            <ActionButton
              label="Go to workout"
              onPress={handleGoToWorkoutClick}
              uppercase
              style={Platform.select({
                web: tailwind(`cursor-pointer rounded-lg ${isMediumScreen ? 'px-2' : ''} `),
                native: tailwind(` rounded-lg px-2`),
              })}
            />
          </Container>
        </>
      );
    }
    return (
      <>
        <Container
          style={Platform.select({
            web: tailwind(`w-full flex-1 flex-row items-center justify-between gap-4`),
          })}>
          <WorkoutSessionStatusWithIcon
            itemStatus={workoutDetail?.status?.toUpperCase() as 'FINISHED' | 'PENDING'}
          />
        </Container>
        <ActionButton
          label="Go to workout"
          onPress={handleGoToWorkoutClick}
          uppercase
          style={Platform.select({
            web: tailwind(`cursor-pointer rounded-lg`),
          })}
        />
      </>
    );
  };

  return (
    <Container
      style={Platform.select({
        web: isLargeScreen ? tailwind('flex flex-col  p-4') : tailwind(''),
        native: tailwind('flex flex-col gap-4 p-4'),
      })}>
      <Container
        style={[
          Platform.select({
            web: tailwind(`
               ${isMediumScreen ? 'flex-col items-start justify-start gap-4' : 'flex-row items-center justify-between  px-32 pt-4'}   
            `),
            native: tailwind(' flex-col items-start justify-start gap-4 pt-4'),
          }),
        ]}>
        <Container
          style={Platform.select({
            web: tailwind('mr-4 flex-1 flex-row flex-wrap items-center justify-start gap-2'),
            native: tailwind('flex-row flex-wrap items-center justify-start gap-2'),
          })}>
          <Container>
            <BackActionButton />
          </Container>
          <LabelContainer
            label={workoutDetail?.name ?? ''}
            labelStyle={[
              tailwind(`${isLargeScreen ? 'text-[1.0625rem]' : 'text-[1.5rem]'} font-bold`),
            ]}
            containerStyle={[
              Platform.select({
                web: tailwind(`
                  ${isLargeScreen ? 'flex-1 justify-between' : 'ml-2 flex-1'}
                `),
                native: tailwind('flex-1 justify-between'),
              }),
            ]}
          />
        </Container>
        {renderRightSection()}
      </Container>
    </Container>
  );
};

export default WorkoutSessionHeader;
