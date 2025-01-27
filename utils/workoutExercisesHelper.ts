import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGES_KEYS } from './appConstants';
import { getWorkouts, saveWorkouts } from './workoutStorageOperationHelper';
import { getWorkoutSessions, setWorkoutSessions } from './workoutSessionHelper';
import { ExerciseElement } from '@/services/interfaces';

export interface IWorkoutExercisesHelper {
  _id: string;
  name: string;
  value: string;
  label: string;
}

// 1. Get current workout session from AsyncStorage
export const getWorkoutExercisesList = async (): Promise<IWorkoutExercisesHelper[]> => {
  try {
    const sessionData = await AsyncStorage.getItem(STORAGES_KEYS.WORKOUT_EXERCISES);
    return sessionData ? JSON.parse(sessionData) : [];
  } catch (error) {
    console.error('Error fetching workout exercises:', error);
    return [];
  }
};

// Add workout exercises to AsyncStorage
export const addWorkoutExercises = async (
  workoutExercises: IWorkoutExercisesHelper,
): Promise<void> => {
  try {
    const sessions = await getWorkoutExercisesList();
    const updatedSessions = [...sessions, workoutExercises];
    await saveWorkoutExercisesHelpers(updatedSessions);
  } catch (error) {
    console.error('Error adding workout exercises:', error);
  }
};

// remove workout exercises by id
export const removeworkoutExercisesHelperById = async (sessionId: string): Promise<void> => {
  try {
    const sessions = await getWorkoutExercisesList();
    const updatedSessions = sessions.filter(session => session._id !== sessionId);
    await saveWorkoutExercisesHelpers(updatedSessions);
  } catch (error) {
    console.error('Error removing workout session:', error);
  }
};

// 2. Set workout exercises to AsyncStorage (overwrites existing data)
export const saveWorkoutExercisesHelpers = async (
  workoutExercises: IWorkoutExercisesHelper[],
): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGES_KEYS.WORKOUT_EXERCISES, JSON.stringify(workoutExercises));
  } catch (error) {
    console.error('Error setting workout sessions:', error);
  }
};

export const updateWorkoutIdInWorkoutSession = async (
  oldExerciseId: string,
  newExerciseId: string,
): Promise<void> => {
  try {
    const sessions = await getWorkoutExercisesList();
    const updatedSessions = sessions.map(session => {
      if (session._id === oldExerciseId) {
        return {
          ...session,
          exerciseId: newExerciseId,
        };
      }
      return session;
    });
    await saveWorkoutExercisesHelpers(updatedSessions);
    console.log('Updated workout sessions:', updatedSessions);
  } catch (error) {
    console.error('Error updating workout session:', error);
  }
};

export const updateExerciseIdsInLocalStorage = async (
  oldExerciseId: string,
  newExerciseId: string,
): Promise<void> => {
  try {
    // Step 1: Update in workouts
    const workouts = await getWorkouts();
    const updatedWorkouts = workouts.map(workout => {
      if (workout.exercises && workout.exercises.length > 0) {
        workout.exercises = workout.exercises.map((exercise: ExerciseElement) => {
          if (exercise.exerciseId === oldExerciseId) {
            return {
              ...exercise,
              exerciseId: newExerciseId, // Replace oldExerciseId with newExerciseId
            };
          }
          return exercise;
        });
      }
      return workout;
    });

    await saveWorkouts(updatedWorkouts); // Save updated workouts back to local storage

    // Step 2: Update in workout sessions
    const workoutSessions = await getWorkoutSessions();
    const updatedWorkoutSessions = workoutSessions.map(session => {
      if (session.exercises && session.exercises.length > 0) {
        session.exercises = session.exercises.map(exercise => {
          if (exercise.exerciseId === oldExerciseId) {
            return {
              ...exercise,
              exerciseId: newExerciseId, // Replace oldExerciseId with newExerciseId
            };
          }
          return exercise;
        });
      }
      return session;
    });

    await setWorkoutSessions(updatedWorkoutSessions); // Save updated workout sessions back to local storage

    console.log(`Updated exerciseId from ${oldExerciseId} to ${newExerciseId} in local storage.`);
  } catch (error) {
    console.error('Error updating exercise IDs in local storage:', error);
  }
};
