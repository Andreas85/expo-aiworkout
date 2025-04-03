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
}: {
  workoutHistory: any[];
  showSaveButton?: boolean;
  toggleModal: () => void;
  handleFeedback: (feedback: WorkoutFeedback, workoutHistoryId: string) => void;
  isPendingGenerateWorkout?: boolean;
}) {
  const renderer = (workout: WorkoutHistory, visiblility?: boolean) => {
    if (visiblility) return;
    if (workout?.feedback) {
      return <ChatMessage isBot={false}>{workout?.feedback} </ChatMessage>;
    }
    return (
      <ChatMessage isBot={true}>
        <WorkoutFeedbackView onSubmit={feedback => handleFeedback(feedback, workout?.historyId)} />
      </ChatMessage>
    );
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
                isLastItem={isLastItem}
              />
            </ChatMessage>
            {renderer(workout, showSaveButton)}

            {isLastItem && isPendingGenerateWorkout ? (
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
