import { useSyncDataStore } from '@/store/useSyncDataStore';
import { syncAllData } from './SyncWorkoutDataHelper';
import { syncAllDataWithSessions } from './SyncWorkoutSessionData';
import { getWorkoutSessions, setWorkoutSessions } from './workoutSessionHelper';
import { getWorkouts, saveWorkouts } from './workoutStorageOperationHelper';
import { getWorkoutExercisesList } from './workoutExercisesHelper';
import { syncExercises } from './SyncExercisesDataHelper';

export interface ISyncProgressTracker {
  total: number;
  completed: number;
  updateProgress: (message: string, completed: number, total: number) => void; // Callback for updating progress in UI
}

export const syncWorkoutData = async () => {
  const syncStore = useSyncDataStore.getState();

  console.log('(SYNC_START) INFO:: workouts exercises:');
  const exercises = await getWorkoutExercisesList(); // Retrieve workouts from local storage or state
  syncStore.startSync(exercises.length);
  await syncExercises(exercises, (message: string, completed: number, total: number) => {
    syncStore.updateProgress(message, completed);
    console.log('(EXERCISES-syncing...)', message); // Update UI with the sync progress message
  });

  console.log('(SYNC_START) INFO:: workouts:');
  const workouts = await getWorkouts(); // Retrieve workouts from local storage or state
  syncStore.startSync(workouts.length);
  await syncAllData(workouts, (message: string, completed: number, total: number) => {
    syncStore.updateProgress(message, completed);
    console.log('(WORKOUT-syncing...)', message); // Update UI with the sync progress message
  });

  const workoutSessions = await getWorkoutSessions(); // Retrieve workouts from local storage or state
  syncStore.startSync(workoutSessions.length);

  console.log('(SYNC_START) INFO:: workoutsession:');
  await syncAllDataWithSessions(
    workoutSessions,
    (message: string, completed: number, total: number) => {
      syncStore.updateProgress(message, completed);
      console.log('(WORKOUT-session-syncing...)', message); // Update UI with the sync progress message
    },
  );
  syncStore.finishSync();
};

export const checkHasDataInStorage = async () => {
  const workouts = await getWorkouts();
  const workoutSessions = await getWorkoutSessions();
  return workouts.length > 0 || workoutSessions.length > 0;
};

export const clearStorageUnSyncData = async () => {
  await Promise.all([setWorkoutSessions([]), saveWorkouts([])]);
};
