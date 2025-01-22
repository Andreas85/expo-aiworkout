import { syncAllData } from './SyncWorkoutDataHelper';
import { getWorkouts } from './workoutStorageOperationHelper';

export const syncWorkoutData = async () => {
  const workouts = await getWorkouts(); // Retrieve workouts from local storage or state
  console.log('(SYNC_START) INFO::');
  await syncAllData(workouts, (message: string) => {
    console.log(message); // Update UI with the sync progress message
  });
};
