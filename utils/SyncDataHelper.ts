// import { syncAllData } from './SyncWorkoutDataHelper';
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
  console.log('(SYNC_START) INFO:: workouts:');
  const workouts = await getWorkouts(); // Retrieve workouts from local storage or state
  await syncAllData(workouts, (message: string) => {
    console.log('(WORKOUT-syncing...)', message); // Update UI with the sync progress message
  });

  const workoutSessions = await getWorkoutSessions(); // Retrieve workouts from local storage or state
  console.log('(SYNC_START) INFO:: workoutsession:');
  await syncAllDataWithSessions(workoutSessions, (message: string) => {
    console.log('(WORKOUT-session-syncing...)', message); // Update UI with the sync progress message
  });
};
