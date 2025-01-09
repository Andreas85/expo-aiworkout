import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGES_KEYS } from './appConstants';
import { mapExerciseElementToExercise } from './helper';
import { ExerciseElement } from '@/services/interfaces';

interface WorkoutSession {
  _id: string;
  workoutId: string;
  exercises: ExerciseElement[];
  status: string;
  totalDuration: number;
  totalExercisesCompleted: number;
  totalWeightTaken: number;
  totalRestTaken: number;
  user: string;
  updatedAt?: string;
}

// 1. Get current workout session from AsyncStorage
export const getWorkoutSession = async (): Promise<WorkoutSession | null> => {
  try {
    const sessionData = await AsyncStorage.getItem(STORAGES_KEYS.WORKOUT_SESSION);
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (error) {
    console.error('Error fetching workout session:', error);
    return null;
  }
};

// 2. Update exercise in the workout session
export const updateExercise = async (
  exerciseId: string,
  durationTaken: number,
  repsTaken: number,
): Promise<void> => {
  try {
    const session = await getWorkoutSession();

    if (session) {
      const updatedExercises = session.exercises.map(exercise => {
        if (exercise._id === exerciseId) {
          return {
            ...exercise,
            isCompleted: true,
            duration: durationTaken,
            reps: repsTaken,
          };
        }
        return exercise;
      });

      const updatedSession = {
        ...session,
        exercises: updatedExercises,
        totalDuration: updatedExercises.reduce((total, exercise) => total + exercise.duration, 0),
        totalExercisesCompleted: updatedExercises.filter(exercise => exercise?.isCompleted).length,
      };

      await AsyncStorage.setItem(STORAGES_KEYS.WORKOUT_SESSION, JSON.stringify(updatedSession));
    }
  } catch (error) {
    console.error('Error updating exercise:', error);
  }
};

// 3. Initialize workout session (if not already in storage)
export const initWorkoutSession = async (workoutSession: WorkoutSession): Promise<void> => {
  try {
    const existingSession = await getWorkoutSession();
    if (!existingSession) {
      await AsyncStorage.setItem(STORAGES_KEYS.WORKOUT_SESSION, JSON.stringify(workoutSession));
    }
  } catch (error) {
    console.error('Error initializing workout session:', error);
  }
};

// 4. Optionally, you can add more methods like syncing with API if needed.

// 1. Get all workout sessions from AsyncStorage
export const getWorkoutSessions = async (): Promise<WorkoutSession[]> => {
  try {
    const sessionsData = await AsyncStorage.getItem(STORAGES_KEYS.WORKOUT_SESSION_LIST);
    return sessionsData ? JSON.parse(sessionsData) : [];
  } catch (error) {
    console.error('Error fetching workout sessions:', error);
    return [];
  }
};

// 2. Set workout sessions to AsyncStorage (overwrites existing data)
export const setWorkoutSessions = async (sessions: WorkoutSession[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGES_KEYS.WORKOUT_SESSION_LIST, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error setting workout sessions:', error);
  }
};

// 3. Add a new workout session
export const addWorkoutSession = async (newSession: WorkoutSession): Promise<void> => {
  try {
    // Map the exercises to the correct format (from ExerciseElement to Exercise)
    const mappedExercises = newSession.exercises.map(mapExerciseElementToExercise);

    // Create a new workout session with mapped exercises
    const sessionToStore = {
      ...newSession,
      exercises: mappedExercises, // Updated with mapped exercises
    };

    const sessions = await getWorkoutSessions();
    sessions.push(sessionToStore); // Add the new session to the list
    await setWorkoutSessions(sessions); // Save the updated sessions to AsyncStorage
  } catch (error) {
    console.error('Error adding new workout session:', error);
  }
};

// 4. Update an existing workout session
export const updateWorkoutSession = async (updatedSession: WorkoutSession): Promise<void> => {
  try {
    const sessions = await getWorkoutSessions();
    const sessionIndex = sessions.findIndex(session => session._id === updatedSession._id);

    if (sessionIndex !== -1) {
      sessions[sessionIndex] = updatedSession; // Update the session
      await setWorkoutSessions(sessions);
    } else {
      console.error('Workout session not found');
    }
  } catch (error) {
    console.error('Error updating workout session:', error);
  }
};

// 5. Update exercise in a workout session
export const updateExerciseInSession = async (
  sessionId: string,
  exerciseId: string,
  durationTaken: number,
  repsTaken: number,
): Promise<void> => {
  try {
    const sessions = await getWorkoutSessions();
    const session = sessions.find(s => s._id === sessionId);
    console.log('Session-update-workout-session', session, sessions);
    if (session) {
      const updatedExercises = session.exercises.map(exercise => {
        if (exercise._id === exerciseId) {
          return {
            ...exercise,
            isCompleted: true,
            duration: durationTaken,
            durationTaken: durationTaken,
            reps: repsTaken,
          };
        }
        return exercise;
      });

      const updatedSession = {
        ...session,
        exercises: updatedExercises,
        totalDuration: updatedExercises.reduce((total, exercise) => total + exercise.duration, 0),
        totalExercisesCompleted: updatedExercises.filter(exercise => exercise.isCompleted).length,
      };

      await updateWorkoutSession(updatedSession); // Save the updated session
    } else {
      console.error('Workout session not found');
    }
  } catch (error) {
    console.error('Error updating exercise in session:', error);
  }
};

/**
 * Get a workout session by its ID from AsyncStorage
 */
export const getWorkoutSessionById = async (sessionId: string): Promise<WorkoutSession | null> => {
  try {
    // Get all workout sessions from AsyncStorage
    const storedWorkoutSessions = await AsyncStorage.getItem(STORAGES_KEYS.WORKOUT_SESSION_LIST);

    // If no sessions are stored, return null
    if (!storedWorkoutSessions) {
      return null;
    }

    // Parse the JSON string into an array of WorkoutSession objects
    const workoutSessions: WorkoutSession[] = JSON.parse(storedWorkoutSessions);

    // Find the workout session with the matching ID
    const workoutSession = workoutSessions.find(
      (session: WorkoutSession) => session._id === sessionId,
    );

    return workoutSession || null; // Return the found session, or null if not found
  } catch (error) {
    console.error('Error getting workout session:', error);
    return null; // Return null in case of an error
  }
};

/**
 * Update the status of a workout session by its ID.
 * @param sessionId The workout session ID to update
 * @param newStatus The new status to set ('PENDING' | 'COMPLETED')
 * @returns A promise indicating the success or failure of the update
 */
export const updateWorkoutSessionStatus = async (
  sessionId: string,
  newStatus: 'PENDING' | 'COMPLETED',
): Promise<boolean> => {
  try {
    // Get all workout sessions from AsyncStorage
    const storedWorkoutSessions = await AsyncStorage.getItem(STORAGES_KEYS.WORKOUT_SESSION_LIST);

    // If no sessions are stored, return false
    if (!storedWorkoutSessions) {
      console.error('No workout sessions found');
      return false;
    }

    // Parse the stored sessions into an array of WorkoutSession objects
    const workoutSessions: WorkoutSession[] = JSON.parse(storedWorkoutSessions);

    // Find the workout session by its ID
    const workoutSessionIndex = workoutSessions.findIndex(session => session._id === sessionId);

    // If session not found, return false
    if (workoutSessionIndex === -1) {
      console.error('Workout session not found');
      return false;
    }

    // Update the status of the workout session
    workoutSessions[workoutSessionIndex].status = newStatus;

    // Update the updatedAt field with the current timestamp
    workoutSessions[workoutSessionIndex].updatedAt = new Date().toISOString();

    // Save the updated workout sessions back to AsyncStorage
    await updateWorkoutSession(workoutSessions[workoutSessionIndex]);

    console.log('Workout session status updated successfully', workoutSessions);
    return true; // Successfully updated the status
  } catch (error) {
    console.error('Error updating workout session status:', error);
    return false; // In case of any error
  }
};
