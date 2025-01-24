import { addExerciseToWorkoutRequest, addWorkoutService } from '@/services/workouts';
import { ISyncProgressTracker } from './SyncDataHelper';
import { updateWorkoutIdInWorkoutSession } from './workoutSessionHelper';
import { deleteWorkout } from './workoutStorageOperationHelper';

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
      const workoutId = workout.workoutId; // Handle existing workoutId
      let data;

      if (!workoutId) {
        // If no workoutId, create a new workout in the DB

        const response = await addWorkoutService({
          formData: {
            name: workout.name,
            createdAt: workout.createdAt,
            updatedAt: workout.updatedAt,
            // Add other required workout fields
          },
        });
        data = response.data;
        // console.log('Workout created with ID:', {
        //   oldWorkoutId: workouts[i]?._id,
        //   newWorkoutId: data?._id,
        // });
        await updateWorkoutIdInWorkoutSession(workouts[i]?._id, data?._id);
      } else {
        data = { _id: workoutId }; // Use the existing workoutId
      }

      successfullySyncedWorkouts.push({
        ...workout,
        workoutId: data?._id,
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

      successfullySyncedExercises.push(exercise);

      tracker.completed++;
      updateProgress(`Syncing exercises ${tracker.completed}/${total}`);
    } catch (error) {
      console.error(`Failed to sync exercise with ID ${exercise._id}:`, error);
    }
  }

  return successfullySyncedExercises;
};

// Utility to sync all data
export const syncAllData = async (
  workouts: any[],
  updateProgress: (message: string) => void,
): Promise<void> => {
  const totalWorkouts = workouts.length;
  const totalExercises = workouts.reduce(
    (acc, workout) => acc + (workout.exercises?.length || 0),
    0,
  );
  const totalSessions = workouts.length; // Assuming each workout has a session
  const totalItems = totalWorkouts + totalExercises + totalSessions;

  const tracker: ISyncProgressTracker = {
    total: totalItems,
    completed: 0,
    updateProgress,
  };

  // Step 1: Sync workouts and get the new IDs
  const successfullySyncedWorkouts = await syncWorkouts(workouts, tracker);

  // Step 2: Sync exercises for each successfully synced workout
  for (const workout of successfullySyncedWorkouts) {
    if (workout.exercises?.length) {
      await syncExercisesForWorkout(
        workout.workoutId, // Use the workoutId from the API response
        workout.exercises,
        tracker,
      );
    }
  }

  // const workoutSessions = await getWorkoutSessions();

  // // Step 3: Sync workout sessions for each workout
  // await syncWorkoutSessions(workoutSessions, tracker);

  // Step 4: Remove successfully synced workouts from local storage
  for (const workout of successfullySyncedWorkouts) {
    await deleteWorkout(workout._id);
  }
};
