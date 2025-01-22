import { syncAllData } from './SyncWorkoutDataHelper';
import { syncAllDataWithSessions } from './SyncWorkoutSessionData';
import { getWorkoutSessions } from './workoutSessionHelper';
import { getWorkouts } from './workoutStorageOperationHelper';

export const syncWorkoutData = async () => {
  const workouts = await getWorkouts(); // Retrieve workouts from local storage or state
  console.log('(SYNC_START) INFO:: workouts:');
  const workoutSessions = await getWorkoutSessions(); // Retrieve workouts from local storage or state
  await syncAllData(workouts, (message: string) => {
    console.log(message); // Update UI with the sync progress message
  });

  console.log('(SYNC_START) INFO:: workoutsession:');
  await syncAllDataWithSessions(workoutSessions, (message: string) => {
    console.log(message); // Update UI with the sync progress message
  });
};
