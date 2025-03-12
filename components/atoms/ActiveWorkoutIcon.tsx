import { Image, Platform, TouchableOpacity } from 'react-native';
import React from 'react';
import { IMAGES } from '@/utils/images';
import { tailwind } from '@/utils/tailwind';
import Container from './Container';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import useTimer from '@/hooks/useTimer';
import ExerciseInstructionModal from '../modals/ExerciseInstructionModal';
import useModal from '@/hooks/useModal';
import { useWorkoutSessionStore } from '@/store/workoutSessiondetail';
import { ExerciseElement } from '@/services/interfaces';

const ActiveWorkoutIcon = (props: { item: ExerciseElement; isDraggableExerciseCard?: boolean }) => {
  const { item, isDraggableExerciseCard = false } = props;
  const { hideModal, showModal, openModal } = useModal();
  const { isLargeScreen } = useWebBreakPoints();
  const isActiveRepExerciseCard = useWorkoutSessionStore(state => state.isActiveRepExerciseCard);

  const { elapsedTime, remainingTime, handlePlay, handlePause, handleStop } = useTimer();

  const handleActiveWorkoutIconClick = () => {
    console.log('Active Workout Icon Clicked');
    handlePause();
    showModal();
  };

  const getContainerWebStyle = () => {
    if (isActiveRepExerciseCard) {
      return isLargeScreen ? 'bottom-4 right-[12px]' : `bottom-4 right-11`;
    }
    return isLargeScreen ? 'right-[12px] bottom-4' : `right-[160px] bottom-4`;
  };

  const getContainerNativeStyle = () => {
    if (isActiveRepExerciseCard) {
      return isLargeScreen ? 'bottom-4 right-[12px]' : `bottom-4 right-11`;
    }
    return isLargeScreen ? 'right-[12px] bottom-4' : `right-[160px] bottom-4`;
  };
  return (
    <>
      <Container
        style={Platform.select({
          web: tailwind(
            isDraggableExerciseCard ? `z-50 ` : `absolute  ${getContainerWebStyle()} z-50 `,
          ),
          native: tailwind(
            isDraggableExerciseCard ? `z-50` : `absolute  ${getContainerNativeStyle()} z-50 `,
          ),
        })}>
        <TouchableOpacity activeOpacity={1} onPress={handleActiveWorkoutIconClick}>
          <Image
            source={IMAGES.workoutactive}
            resizeMode="contain"
            style={Platform.select({
              web: tailwind(
                isDraggableExerciseCard
                  ? `aspect-square h-[2.5rem] w-[2.5rem]`
                  : `aspect-square ${isLargeScreen ? 'h-[2.5rem] w-[2.5rem]' : 'h-[2.5rem] w-[2.5rem] '} `,
              ),
              native: tailwind('aspect-square h-10 w-10'),
            })}
          />
        </TouchableOpacity>
      </Container>
      {openModal && (
        <ExerciseInstructionModal item={item} isVisible={openModal} toggleModal={hideModal} />
      )}
    </>
  );
};

export default ActiveWorkoutIcon;
