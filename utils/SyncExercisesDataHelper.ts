import { ISyncProgressTracker } from './SyncDataHelper';
import {
  removeworkoutExercisesHelperById,
  updateExerciseIdsInLocalStorage,
} from './workoutExercisesHelper';
import { addExerciseService } from '@/services/exercises';

export const syncExerciseData = async (
  exercises: any[],
  tracker: ISyncProgressTracker,
): Promise<any[]> => {
  const { total, updateProgress } = tracker;
  const successfullySyncedExercises: any[] = [];

  for (const exercise of exercises) {
    const oldExerciseId = exercise.exerciseId;
    try {
      const response = await addExerciseService({
        formData: {
          ...exercise,
        },
      });

      const newExerciseId = response.data._id;
      successfullySyncedExercises.push({
        ...exercise,
        exerciseId: newExerciseId,
      });
      // Update exercise IDs in workouts and workout sessions
      if (newExerciseId !== oldExerciseId) {
        await updateExerciseIdsInLocalStorage(oldExerciseId, newExerciseId);
      }

      tracker.completed++;
      updateProgress(`Synced exercise ${tracker.completed}/${total}`, tracker.completed, total);
    } catch (error) {
      console.error(`Failed to sync exercise with ID ${oldExerciseId}:`, error);
    }
  }
  return successfullySyncedExercises;
};

export const syncExercises = async (
  exercises: any[],
  updateProgress: (message: string, completed: number, total: number) => void,
) => {
  const totalExercises = exercises.length;
  const totalItems = totalExercises;

  const tracker: ISyncProgressTracker = {
    total: totalItems,
    completed: 0,
    updateProgress,
  };

  const successfullySyncedExercises = await syncExerciseData(exercises, tracker);

  // Step 4: Remove successfully synced workouts from local storage
  for (const exercise of successfullySyncedExercises) {
    await removeworkoutExercisesHelperById(exercise._id);
  }
};
