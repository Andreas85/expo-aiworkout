import { addExerciseToWorkoutRequest, addWorkoutService } from '@/services/workouts';
import { deleteWorkout } from './workoutStorageOperationHelper';

interface ISyncProgressTracker {
  total: number;
  completed: number;
  updateProgress: (message: string) => void; // Callback for updating progress in UI
}

// Utility to sync workouts
export const syncWorkouts = async (
  workouts: any[],
  tracker: ISyncProgressTracker,
): Promise<any[]> => {
  const { total, updateProgress } = tracker;
  const successfullySyncedWorkouts: any[] = [];

  for (let i = 0; i < workouts.length; i++) {
    const workout = workouts[i];
    try {
      // Sync workout with the server
      const { data } = await addWorkoutService({
        formData: {
          name: workout.name,
          createdAt: workout.createdAt,
          updatedAt: workout.updatedAt,
          // Add other required workout fields
        },
      });

      //   console.log('(Response)INFO:', data);

      // Add the new workout ID from the response
      successfullySyncedWorkouts.push({
        ...workout,
        workoutId: data?._id, // Assuming `workoutId` is part of the API response
      });

      // Update progress tracker
      tracker.completed++;
      updateProgress(`Syncing workouts ${tracker.completed}/${total}`);
    } catch (error) {
      console.error(`Failed to sync workout with ID ${workout._id}:`, error);
    }
  }

  return successfullySyncedWorkouts;
};

// Utility to sync exercises for a specific workout
export const syncExercisesForWorkout = async (
  workoutId: string,
  exercises: any[],
  tracker: ISyncProgressTracker,
): Promise<any[]> => {
  const { total, updateProgress } = tracker;
  const successfullySyncedExercises: any[] = [];

  for (let i = 0; i < exercises.length; i++) {
    const exercise = exercises[i];
    try {
      // Sync exercise with the server
      await addExerciseToWorkoutRequest({
        queryParams: { id: workoutId },
        formData: {
          exerciseId: exercise.exerciseId,
          name: exercise.name,
          reps: exercise.reps,
          rest: exercise.rest,
          weight: exercise.weight,
          duration: exercise.duration,
          order: exercise.order,
          createdAt: exercise.createdAt,
          updatedAt: exercise.updatedAt,
          // Add other required exercise fields
        },
      });

      // Mark exercise as successfully synced
      successfullySyncedExercises.push(exercise);

      // Update progress tracker
      tracker.completed++;
      updateProgress(`Syncing exercises ${tracker.completed}/${total}`);
    } catch (error) {
      console.error(`Failed to sync exercise with ID ${exercise._id}:`, error);
    }
  }

  return successfullySyncedExercises;
};

// Utility to sync all workouts and their exercises
export const syncAllData = async (
  workouts: any[],
  updateProgress: (message: string) => void,
): Promise<void> => {
  const totalWorkouts = workouts.length;
  const totalExercises = workouts.reduce(
    (acc, workout) => acc + (workout.exercises?.length || 0),
    0,
  );
  const totalItems = totalWorkouts + totalExercises;

  const tracker: ISyncProgressTracker = {
    total: totalItems,
    completed: 0,
    updateProgress,
  };

  // Sync workouts and get the new IDs
  const successfullySyncedWorkouts = await syncWorkouts(workouts, tracker);

  // Sync exercises for each successfully synced workout
  for (const workout of successfullySyncedWorkouts) {
    if (workout.exercises?.length) {
      await syncExercisesForWorkout(
        workout.workoutId, // Use the new workoutId from the API response
        workout.exercises,
        tracker,
      );
    }
  }

  // Remove successfully synced workouts from local storage
  for (const workout of successfullySyncedWorkouts) {
    // Sync exercises for each successfully synced workout
    await deleteWorkout(workout._id);
  }
};
