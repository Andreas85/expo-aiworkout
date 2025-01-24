// import { syncAllData } from './SyncWorkoutDataHelper';
import { useSyncDataStore } from '@/store/useSyncDataStore';
import { syncAllData } from './SyncWorkoutDataHelper';
import { syncAllDataWithSessions } from './SyncWorkoutSessionData';
import { getWorkoutSessions } from './workoutSessionHelper';
import { getWorkouts } from './workoutStorageOperationHelper';

export interface ISyncProgressTracker {
  total: number;
  completed: number;
  updateProgress: (message: string) => void; // Callback for updating progress in UI
}

export const syncWorkoutData = async () => {
  const syncStore = useSyncDataStore.getState();

  console.log('(SYNC_START) INFO:: workouts:');
  const workouts = await getWorkouts(); // Retrieve workouts from local storage or state
  syncStore.startSync(workouts.length);
  await syncAllData(workouts, (message: string) => {
    syncStore.updateProgress(message, syncStore.completed + 1);
    console.log('(WORKOUT-syncing...)', message); // Update UI with the sync progress message
  });

  const workoutSessions = await getWorkoutSessions(); // Retrieve workouts from local storage or state
  syncStore.startSync(workoutSessions.length);

  console.log('(SYNC_START) INFO:: workoutsession:');
  await syncAllDataWithSessions(workoutSessions, (message: string) => {
    syncStore.updateProgress(message, syncStore.completed + 1);
    console.log('(WORKOUT-session-syncing...)', message); // Update UI with the sync progress message
  });
  syncStore.finishSync();
};
