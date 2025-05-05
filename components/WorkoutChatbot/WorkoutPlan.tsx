import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { ActionButton } from '../atoms/ActionButton';
import { tailwind } from '@/utils/tailwind';
import TextContainer from '../atoms/TextContainer';
import { generateSaveGeneratedWorkoutService } from '@/services/workouts';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { WorkoutPlan } from '@/types';

interface WorkoutPlanProps {
  plan: WorkoutPlan;
  showSaveButton: boolean;
  toggleModal: () => void;
  isLastItem?: boolean;
  isRegenerateWorkout?: boolean;
  handleUpdateWorkout?: () => void;
  errorMessage?: string;
  isPendingGenerateWorkout?: boolean;
}

export function WorkoutPlanView({
  plan,
  showSaveButton,
  toggleModal,
  isLastItem = false,
  isRegenerateWorkout = false,
  isPendingGenerateWorkout = false,
  handleUpdateWorkout,
  errorMessage,
}: WorkoutPlanProps) {
  const [responseError, setResponseError] = useState<string>('');
  const { mutate: mutateSaveGenerateWorkout, isPending: isPendingSaveGenerateWorkout } =
    useMutation({
      mutationFn: generateSaveGeneratedWorkoutService,
      onSuccess: data => {
        console.log('Workout saved', data);
        setResponseError('');
        toggleModal?.();
        const workoutId = data?.data?._id;
        router.push(`/workout/${workoutId}`);
      },
      onError: (error: string) => {
        console.log('Workout Save Generated workout error:', error);
        setResponseError(error);
      },
    });

  useEffect(() => {
    if (errorMessage) {
      setResponseError(errorMessage);
    }
  }, [errorMessage]);

  const handleSaveWorkout = async () => {
    console.log('Save workout plan');
    if (isRegenerateWorkout) {
      console.log('Regenerate workout plan:', plan);
      handleUpdateWorkout?.();
      return;
    }
    mutateSaveGenerateWorkout(plan);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="dumbbell" size={24} color="#6b46c1" />
        <Text style={styles.title}>Your Personalized Workout Plan </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Workout Details</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Name:</Text>
          <Text style={styles.detailText}>{plan?.name}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Exercises </Text>
        {plan?.exercises?.map((exercise, index) => (
          <View key={index} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>
              {exercise.name || exercise?.exercise?.name || ''}
            </Text>
            <View style={styles.exerciseDetails}>
              {exercise.reps ? (
                <Text style={styles.exerciseText}>Reps: {exercise.reps || 0}</Text>
              ) : (
                <Text style={styles.exerciseText}>Duration: {exercise.duration || 0}</Text>
              )}
              <Text style={styles.exerciseText}>Rest: {exercise.rest || 0}</Text>
              <Text style={styles.exerciseText}>Weight: {exercise.weight || 0}</Text>
            </View>
          </View>
        ))}
      </View>

      {plan?.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <Text style={styles.notesText}>{plan?.notes}</Text>
        </View>
      )}
      {isLastItem && responseError && (
        <TextContainer
          style={tailwind('text-3 text-center text-red-400')}
          className="text-center text-sm !text-red-400"
          data={responseError}
        />
      )}

      {isLastItem && showSaveButton && (
        <ActionButton
          label={'Save Workout Plan'}
          onPress={handleSaveWorkout}
          isLoading={isPendingSaveGenerateWorkout || isPendingGenerateWorkout}
          style={tailwind('rounded-lg')}
        />
      )}
    </View>
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
