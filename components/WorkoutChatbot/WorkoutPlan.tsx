import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { ActionButton } from '../atoms/ActionButton';
import { tailwind } from '@/utils/tailwind';

interface WorkoutPlanProps {
  plan: {
    exercises?: {
      name: string;
      sets: number;
      reps: string;
      rest: string;
      duration?: string;
      weight?: string;
    }[];
    name?: string;
    notes?: string;
  };
  onSave: () => void;
  showSaveButton: boolean;
}

export function WorkoutPlanView({ plan, onSave, showSaveButton }: WorkoutPlanProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="dumbbell" size={24} color="#6b46c1" />
        <Text style={styles.title}>Your Personalized Workout Plan</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Workout Details</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Name:</Text>
          <Text style={styles.detailText}>{plan.name}</Text>
        </View>
        {/* <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Frequency:</Text>
          <Text style={styles.detailText}>{plan.frequency}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailText}>{plan.duration}</Text>
        </View> */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Exercises</Text>
        {plan?.exercises?.map((exercise, index) => (
          <View key={index} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <View style={styles.exerciseDetails}>
              {/* <Text style={styles.exerciseText}>Duration: {exercise.duration}</Text> */}
              <Text style={styles.exerciseText}>Reps: {exercise.reps}</Text>
              <Text style={styles.exerciseText}>Rest: {exercise.rest}</Text>
              <Text style={styles.exerciseText}>Weight: {exercise.weight}</Text>
            </View>
          </View>
        ))}
      </View>

      {plan.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <Text style={styles.notesText}>{plan.notes}</Text>
        </View>
      )}

      {showSaveButton && (
        <ActionButton
          label={'Save Workout Plan '}
          onPress={onSave}
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
