// @/components/WorkoutHistoryView.tsx
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ChatMessage } from './ChatMessage';
import { WorkoutPlanView } from './WorkoutPlan';
import { WorkoutFeedbackView } from './WorkoutFeedback';
import { WorkoutFeedback, WorkoutHistory, WorkoutPlan } from '@/types';
import { Loader2 } from 'lucide-react';
import { ActionButton } from '../atoms/ActionButton';
import { tailwind } from '@/utils/tailwind';

export function WorkoutHistoryView({
  workoutHistory,
  showSaveButton = false,
  handleFeedback,
  toggleModal,
  isPendingGenerateWorkout = false,
  handleRegenerateWorkout,
  isRegenerateWorkout = false,
  handleUpdateWorkout,
  errorMessage = '',
}: {
  workoutHistory: any[];
  showSaveButton?: boolean;
  toggleModal: () => void;
  handleUpdateWorkout?: () => void;
  handleRegenerateWorkout?: (feedback: string, workoutHistoryId: string) => void;
  handleFeedback?: (feedback: WorkoutFeedback, workoutHistoryId: string) => void;
  isPendingGenerateWorkout?: boolean;
  isRegenerateWorkout?: boolean;
  errorMessage?: string;
}) {
  const renderer = (workout: WorkoutHistory, index: number, visiblility?: boolean) => {
    if (workout?.feedback) {
      return <ChatMessage isBot={false}>{workout?.feedback} </ChatMessage>;
    }
    if (!visiblility) {
      return (
        <ChatMessage isBot={true}>
          <WorkoutFeedbackView
            onSubmit={feedback => handleFeedback?.(feedback, workout?.historyId)}
            onSubmitRegenerate={feedback => handleRegenerateWorkout?.(feedback, workout?.historyId)}
            isEditGeneratedWorkout={isRegenerateWorkout}
            isEditLoading={isPendingGenerateWorkout}
            isFirstItem={isRegenerateWorkout ? index === 0 : false}
          />
        </ChatMessage>
      );
    }
  };

  return (
    <>
      {workoutHistory?.map((workout: WorkoutHistory, index) => {
        const isLastItem = index === workoutHistory.length - 1;

        return (
          <React.Fragment key={workout?.historyId}>
            <ChatMessage isBot={true}>
              <WorkoutPlanView
                plan={workout.workoutPlan}
                showSaveButton={showSaveButton}
                toggleModal={toggleModal}
                isRegenerateWorkout={isRegenerateWorkout}
                isPendingGenerateWorkout={isPendingGenerateWorkout}
                handleUpdateWorkout={handleUpdateWorkout}
                isLastItem={isLastItem}
                errorMessage={errorMessage}
              />
            </ChatMessage>
            {renderer(workout, index, showSaveButton)}

            {isLastItem && isPendingGenerateWorkout && !showSaveButton ? (
              <ActionButton
                label={'Updating your workout plan...'}
                isLoading={isPendingGenerateWorkout}
                style={tailwind('rounded-lg')}
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a202c',
    padding: 16,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    color: '#bbb',
  },
  detailText: {
    color: 'white',
    fontWeight: 'bold',
  },
  exerciseCard: {
    backgroundColor: '#2c2c3e',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  exerciseName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    flex: 1,
  },
  exerciseText: {
    color: '#bbb',
    flex: 1,
  },
  notesText: {
    color: '#bbb',
  },
  saveButton: {
    backgroundColor: '#6b46c1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
