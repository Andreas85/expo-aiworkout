import { Platform, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { tailwind } from '@/utils/tailwind';
import Container from './Container';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import useTimer from '@/hooks/useTimer';
import { Foundation } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useWorkoutSessionStore } from '@/store/workoutSessiondetail';
import ExerciseNotesModal from '../modals/ExerciseNotesModal';
import useModal from '@/hooks/useModal';
import { ExerciseElement } from '@/services/interfaces';
import { hasValidData } from '@/utils/helper';

const ActiveWorkoutNotes = (props: {
  item: ExerciseElement;
  isDraggableExerciseCard?: boolean;
  isNonActiveCard?: boolean;
}) => {
  const { item, isDraggableExerciseCard = false, isNonActiveCard = false } = props;
  const { isLargeScreen } = useWebBreakPoints();
  const { hideModal, showModal, openModal } = useModal();
  const { handlePause } = useTimer();
  const hasNotes = hasValidData(item, 'notes') ? item.notes : null;
  const isActiveRepExerciseCard = useWorkoutSessionStore(state => state.isActiveRepExerciseCard);

  const handleActiveWorkoutIconClick = () => {
    console.log('Active Workout Icon Clicked');
    handlePause();
    showModal();
  };

  const getContainerWebStyle = () => {
    if (isNonActiveCard && isLargeScreen) {
      return `bottom-0.6 right-12`;
    }
    if (isActiveRepExerciseCard) {
      return isLargeScreen
        ? 'bottom-4 right-[62px]'
        : isNonActiveCard
          ? `bottom-0.5 right-20`
          : `bottom-4 right-28`;
    }
    return isLargeScreen ? 'bottom-4 right-[75px]' : `bottom-4 right-[218px]`;
  };

  const getContainerNativeStyle = () => {
    if (isNonActiveCard && isLargeScreen) {
      return `bottom-0.6 right-12`;
    }
    if (isActiveRepExerciseCard) {
      return 'bottom-4 right-[58px]';
    }
    return 'bottom-4 right-[60px]';
  };

  const getIconSize = () => {
    if (isNonActiveCard && isLargeScreen) {
      return 24;
    }
    if (isDraggableExerciseCard) {
      return 28;
    } else {
      return 38;
    }
  };
  return (
    <>
      <Container
        style={Platform.select({
          web: tailwind(
            isDraggableExerciseCard ? `z-50` : `absolute  ${getContainerWebStyle()} z-50 `,
          ),
          native: tailwind(
            isDraggableExerciseCard ? `z-50` : `absolute  ${getContainerNativeStyle()} z-50 `,
          ),
        })}>
        <TouchableOpacity activeOpacity={1} onPress={handleActiveWorkoutIconClick}>
          <Foundation
            name="clipboard-notes"
            size={getIconSize()}
            color={hasNotes ? '#EBB866' : Colors.brandColor}
          />
        </TouchableOpacity>
      </Container>
      {openModal && (
        <ExerciseNotesModal item={item} isVisible={openModal} toggleModal={hideModal} />
      )}
    </>
  );
};

export default ActiveWorkoutNotes;
