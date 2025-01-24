import {
  createWorkoutSession,
  updateWorkoutSessionFinishedStatus,
  updateWorkoutSessionService,
} from '@/services/workouts';
import { removeWorkoutSessionById } from './workoutSessionHelper';
import { WORKOUT_STATUS } from './appConstants';

interface ISyncProgressTracker {
  total: number;
  completed: number;
  updateProgress: (message: string) => void; // Callback for updating progress in UI
}

export const syncWorkoutSessions = async (
  workoutSessions: any[],
  tracker: ISyncProgressTracker,
): Promise<any[]> => {
  const { total, updateProgress } = tracker;
  const successfullySyncedWorkoutSessions: any[] = [];
  console.log('workoutSessions:', workoutSessions);
  for (const sessionData of workoutSessions) {
    try {
      // Step 1: Create workout if `workoutId` is undefined
      console.log('Creating new workout for session:1', sessionData.workoutId);

      // Step 3: Create the workout session
      const { data: sessionDataResponse } = await createWorkoutSession({
        formData: {
          id: sessionData.workoutId,
        },
      });

      successfullySyncedWorkoutSessions.push({
        ...sessionData,
        sessionId: sessionDataResponse?._id,
      });

      // Update progress tracker
      tracker.completed++;
      updateProgress(`Synced workout session ${tracker.completed}/${total}`);
    } catch (error) {
      console.error('Error syncing workout session:', error, sessionData);
    }
  }

  return successfullySyncedWorkoutSessions;
};

// Utility to sync all data including workout sessions
export const syncAllDataWithSessions = async (
  workoutSessions: any[],
  updateProgress: (message: string) => void,
): Promise<void> => {
  const totalSessions = workoutSessions.length;
  const totalItems = totalSessions;

  const tracker: ISyncProgressTracker = {
    total: totalItems,
    completed: 0,
    updateProgress,
  };

  // Sync workout sessions
  // Sync workouts and get the new IDs
  const successfullySyncedWorkoutSessions = await syncWorkoutSessions(workoutSessions, tracker);

  // Iterate through the successfully synced workout sessions
  for (const session of successfullySyncedWorkoutSessions) {
    const exerciseWorkoutSession = session?.exercises;
    if (Array.isArray(exerciseWorkoutSession) && exerciseWorkoutSession.length > 0) {
      for (const exercise of exerciseWorkoutSession) {
        // console.log('exercise:', exercise);
        try {
          // Update each exercise for the workout session
          await updateWorkoutSessionService({
            id: session.sessionId, // Use the synced session ID
            formData: {
              exerciseId: exercise?.exerciseId, // ID of the exercise
              durationTaken: exercise.durationTaken,
              isCompleted: exercise.isCompleted,
              repsTaken: exercise.repsTaken,
              // Add other necessary fields
            },
          });

          // Update progress tracker for each exercise
          tracker.completed++;
          updateProgress(`Syncing exercises ${tracker.completed}/${tracker.total}`);
        } catch (error) {
          console.error(`Failed to sync exercise for session ID ${session.sessionId}:`, error);
        }
      }
    }

    if (session?.status === 'FINISHED') {
      try {
        // Update the workout session status
        await updateWorkoutSessionFinishedStatus({
          id: session.sessionId,
          formData: {
            status: WORKOUT_STATUS.FINISHED,
          },
        });
      } catch (error) {
        console.error(
          `Failed to sync workout session status for session ID ${session.sessionId}:`,
          error,
        );
      }
    }

    console.log('Successfully synced workout session:', { workoutId: session?._id });

    // Implement deletion or updating of local storage
    await removeWorkoutSessionById(session?._id);
  }
};
