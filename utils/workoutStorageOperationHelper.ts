import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_EMITTER_KEYS, STORAGES_KEYS } from './appConstants';
import { ExerciseElement, Workout } from '@/services/interfaces';
import { generateBigNumberId } from './helper';
import { DeviceEventEmitter } from 'react-native';

const STORAGE_KEY = STORAGES_KEYS.WORKOUTS_LIST;

// Fetch the array of workouts from AsyncStorage
export const getWorkouts = async (): Promise<any[]> => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Save the array of workouts to AsyncStorage
export const saveWorkouts = async (workouts: any[]): Promise<void> => {
  const results = JSON.stringify(workouts);
  await AsyncStorage.setItem(STORAGE_KEY, results);
  // Emit an event whenever the value is updated
  DeviceEventEmitter.emit(STORAGE_EMITTER_KEYS.REFRESH_WORKOUT_LIST, results);
};

// Add a new workout to the array of workouts in AsyncStorage
export const addWorkout = async (workout: Pick<Workout, 'name'>): Promise<any> => {
  const workouts = await getWorkouts();
  const workoutId = generateBigNumberId();
  // Create a new workout object
  const newWorkout = {
    ...workout,
    _id: workoutId, // Unique ID for the workout
    isPublic: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    exercises: [],
  };

  workouts?.push?.(newWorkout); // Add the new workout to the array
  await saveWorkouts(workouts); // Save the updated array to AsyncStorage
  return workoutId; // Return the workout ID
};

// Edit an existing workout in the array of workouts in AsyncStorage
export const editWorkout = async (
  workoutId: string,
  updatedData: Partial<{
    name: string;
  }>,
): Promise<void> => {
  const workouts = await getWorkouts();

  // Find the workout by ID
  const index = workouts.findIndex(workout => workout._id === workoutId);
  if (index === -1) throw new Error('Workout not found');

  // Update the workout
  workouts[index] = {
    ...workouts[index],
    ...updatedData,
    updatedAt: new Date().toISOString(),
  };

  await saveWorkouts(workouts); // Save the updated array to AsyncStorage
};

// Duplicate workout to the array of workouts in AsyncStorage
export const duplicateWorkout = async (
  workout: Pick<Workout, 'name'>,
  duplicateWorkoutId: string,
): Promise<any> => {
  const workouts = await getWorkouts();
  const duplicatedWorkout = await getWorkoutDetail(duplicateWorkoutId);
  const workoutId = generateBigNumberId();
  // Create a new workout object
  const newWorkout = {
    name: workout.name + ' Copy',
    _id: workoutId, // Unique ID for the workout
    isPublic: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    exercises: duplicatedWorkout?.exercises || [],
  };

  workouts?.push?.(newWorkout); // Add the new workout to the array
  await saveWorkouts(workouts); // Save the updated array to AsyncStorage
  return newWorkout || null; // Return the workout if found, otherwise null
};

// Delete a workout from the array of workouts in AsyncStorage

export const deleteWorkout = async (workoutId: string): Promise<void> => {
  const workouts = await getWorkouts();

  // Remove the workout with the specified ID
  const updatedWorkouts = workouts?.filter(workout => workout._id !== workoutId);

  await saveWorkouts(updatedWorkouts); // Save the updated array to AsyncStorage
};

export const getWorkoutDetail = async (workoutId: string): Promise<any | null> => {
  const workouts = await getWorkouts();

  // Find the workout by ID
  const workout = workouts?.find(workout => workout._id === workoutId);

  return workout || null; // Return the workout if found, otherwise null
};

// Add an exercise to a workout in the array of workouts in AsyncStorage
export const addExerciseToWorkout = async (
  workoutId: string,
  exercise: Partial<ExerciseElement>,
): Promise<void> => {
  const workouts = await getWorkouts();

  // Find the workout by ID
  const workout = workouts?.find(workout => workout._id === workoutId);
  if (!workout) throw new Error('Workout not found');

  // Create a new exercise object with sequential order
  const newExercise = {
    ...exercise,
    _id: generateBigNumberId(), // Unique ID for the exercise
    order: workout.exercises?.length || 0, // Start from 0
    exerciseId: generateBigNumberId(), // Unique ID for the exercise
  };

  workout?.exercises?.push(newExercise); // Add the exercise to the workout
  workout.updatedAt = new Date().toISOString();

  await saveWorkouts(workouts); // Save the updated array to AsyncStorage
  // Emit event after successful operation
  DeviceEventEmitter.emit(STORAGE_EMITTER_KEYS.REFRESH_WORKOUT_DETAILS, {
    action: 'add',
    workoutId,
  });
};

export const editExerciseInWorkout = async (
  workoutId: string,
  exerciseId: string,
  updatedData: Partial<ExerciseElement>,
): Promise<void> => {
  const workouts = await getWorkouts();

  // Find the workout by ID
  const workout = workouts.find(workout => workout._id === workoutId);
  if (!workout) throw new Error('Workout not found');

  // Find the exercise by ID
  const exercise = workout?.exercises?.find((ex: ExerciseElement) => ex._id === exerciseId);
  if (!exercise) throw new Error('Exercise not found');

  // Update the exercise
  Object.assign(exercise, updatedData);
  workout.updatedAt = new Date().toISOString();

  await saveWorkouts(workouts); // Save the updated array to AsyncStorage
};

export const deleteExerciseFromWorkout = async (
  workoutId: string,
  exerciseId: string,
): Promise<void> => {
  const workouts = await getWorkouts();

  // Find the workout by ID
  const workout = workouts?.find(workout => workout._id === workoutId);
  if (!workout) throw new Error('Workout not found');

  // Remove the exercise with the specified ID
  workout.exercises = workout.exercises.filter((ex: ExerciseElement) => ex._id !== exerciseId);
  // Recalculate the order of remaining exercises
  workout.exercises.forEach((ex: ExerciseElement, index: number) => {
    ex.order = index + 1;
  });

  workout.updatedAt = new Date().toISOString();

  await saveWorkouts(workouts); // Save the updated array to AsyncStorage
  // Emit event after successful operation
  DeviceEventEmitter.emit(STORAGE_EMITTER_KEYS.REFRESH_WORKOUT_DETAILS, {
    action: 'delete',
    workoutId,
  });
};

export const sortExercisesInWorkout = async (
  workoutId: string,
  updatedOrder: Record<string, number>, // Object with exerciseId as key and order as value
): Promise<void> => {
  const workouts = await getWorkouts();

  // Find the workout by ID
  const workout = workouts?.find(workout => workout._id === workoutId);
  if (!workout) throw new Error('Workout not found');

  // Map exercise IDs to their updated orders
  workout.exercises?.forEach((exercise: ExerciseElement) => {
    if (updatedOrder[exercise._id] !== undefined) {
      exercise.order = updatedOrder[exercise._id];
    }
  });

  // Sort exercises based on the updated order
  workout.exercises?.sort((a: ExerciseElement, b: ExerciseElement) => a.order - b.order);

  workout.updatedAt = new Date().toISOString();

  await saveWorkouts(workouts); // Save the updated array to AsyncStorage

  // Emit event after successful operation
  DeviceEventEmitter.emit(STORAGE_EMITTER_KEYS.REFRESH_WORKOUT_DETAILS, {
    action: 'sort',
    workoutId,
  });
};

export const updateExercisePropertyOfWorkout = async (
  workoutId: string,
  exerciseId: string,
  property: keyof ExerciseElement, // Ensure the property exists on the Exercise type
  value: any, // The new value for the property
): Promise<void> => {
  try {
    const workouts = await getWorkouts();
    // Find the workout by ID
    const workout = workouts?.find(workout => workout._id === workoutId);
    console.log('workout', { workout, workoutId, exerciseId, property, value });
    if (!workout) throw new Error('Workout not found');

    if (workout) {
      const updatedExercises = workout.exercises.map((exercise: ExerciseElement) => {
        if (exercise?.exerciseId === exerciseId || exercise?._id === exerciseId) {
          return {
            ...exercise,
            [property]: value, // Dynamically update the property
          };
        }
        return exercise;
      });

      workout.exercises = updatedExercises;

      workout.updatedAt = new Date().toISOString();

      await saveWorkouts(workouts); // Save the updated session
      // Emit event after successful operation
      DeviceEventEmitter.emit(STORAGE_EMITTER_KEYS.REFRESH_WORKOUT_DETAILS, {
        action: 'updateExercisePropertyOfWorkout',
        workoutId,
      });
    } else {
      console.error('Workout session not found');
    }
  } catch (error) {
    console.error(`Error updating exercise ${property}:`, error);
  }
};
