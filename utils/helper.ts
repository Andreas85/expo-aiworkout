import { QueryClient } from '@tanstack/react-query';
import { ERROR_MESSAGE, STATUS_COLORS, STRING_DATA } from './appConstants';
import { ExerciseElement } from '@/services/interfaces';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const queryClient = new QueryClient();

export const extractedErrorMessage = (response: any) => {
  return response?.data?.result?.errText ?? ERROR_MESSAGE.SOMETHING_WENT_WRONG;
};

export const formatTimeForMinutes = (seconds: number) => {
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

  return `${formattedMinutes}:${formattedSeconds}`;
};

export function removeParenthesisString(input: any) {
  return input.toString().replace(/\(.*?\)\//g, '');
}

export const pluralise = (count: any, value: any) => {
  return count != 1 ? `${value}s` : `${value}`;
};

export const getReorderItemsForSortingWorkoutExercises = (items: any[]) => {
  const itemOrder = items?.map((item: any, index: number) => ({
    exerciseId: item?._id,
    order: index,
    name: item?.exercise?.name,
  }));

  const modifiedData = Object.fromEntries(
    itemOrder?.map(
      ({ exerciseId, order, name }: { exerciseId: string; order: number; name: string }) => [
        exerciseId,
        order,
        name,
      ],
    ),
  );
  return modifiedData;
};

export const getWorkoutRemainingTime = (totalTime: number, elapsedTime: number) => {
  const diff = totalTime - elapsedTime;
  return diff > 0 ? diff : 0;
};

export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

export const calculateTotalDuration = (exercises: ExerciseElement[]) => {
  return (
    exercises?.length &&
    exercises.reduce((totalDuration: any, exercise: ExerciseElement) => {
      return totalDuration + exercise.duration + exercise?.rest;
    }, 0)
  );
};

export const calculateDurationOFCompleteExercises = (exercises: ExerciseElement[]) => {
  return (
    exercises?.length &&
    exercises.reduce((totalDuration: number, exercise: ExerciseElement) => {
      return exercise?.isCompleted
        ? totalDuration + exercise.duration + exercise?.rest
        : totalDuration;
    }, 0)
  );
};

export const calculateElapsedTimeInSec = (exerciseData: any) => {
  let cumulativeTime = 0;

  return (
    exerciseData?.length &&
    exerciseData.map((exercise: ExerciseElement) => {
      if (!exercise.reps) {
        cumulativeTime += exercise.duration;
      }
      return {
        ...exercise,
        elapsedTime: cumulativeTime,
      };
    })
  );
};

export const expandRestAsExercises = (exercises: any) => {
  console.log('expandRestAsExercises', exercises);
  if (!exercises || !exercises.data || !exercises.data.exercises) {
    return exercises;
  }

  const expandedExercises = [];

  for (const exercise of exercises.data.exercises) {
    expandedExercises.push(exercise);

    if (exercise.rest > 0) {
      const restExercise = {
        type: STRING_DATA.REST,
        duration: exercise.rest,
        exercise: {
          name: 'Rest',
        },
      };
      expandedExercises.push(restExercise);
    }
  }

  // Remove last element if it's a rest
  const lastExercise = expandedExercises[expandedExercises.length - 1];
  if (lastExercise && lastExercise.type === STRING_DATA.REST) {
    expandedExercises.pop();
  }

  exercises.data.exercises = expandedExercises;
  return exercises;
};

export const expandRestAsExercisesInExistingExercises = (exercises: ExerciseElement[]) => {
  if (!exercises || exercises.length === 0) {
    return exercises;
  }

  const expandedExercises = [];

  for (let i = 0; i < exercises.length; i++) {
    const exercise = exercises[i];
    expandedExercises.push(exercise);

    // Add a rest exercise only if it's not the last exercise
    if (exercise.rest > 0 && i < exercises.length - 1) {
      const restExercise = {
        type: STRING_DATA.REST,
        duration: exercise.rest,
        exercise: {
          name: 'Rest',
        },
        preExerciseId: exercise._id, // Add preExerciseId to the rest exercise
        preExerciseOrder: exercise.order,
        rest: exercise.rest,
      };
      expandedExercises.push(restExercise);
    }
  }

  return expandedExercises;
};

export function generateBigNumberId(): string {
  let id = uuidv4();
  return id;
}

// Utility function to map ExerciseElement to Exercise interface
export const mapExerciseElementToExercise = (exerciseElement: ExerciseElement): ExerciseElement => {
  return {
    _id: exerciseElement._id,
    exercise: exerciseElement.exercise,
    order: exerciseElement.order,
    exerciseId: exerciseElement._id, // Map _id to exerciseId
    name: exerciseElement.name || '', // Use name from ExerciseElement, default to empty string if not available
    reps: exerciseElement.reps,
    duration: exerciseElement.duration,
    rest: exerciseElement.rest,
    weight: exerciseElement.weight,
    isCompleted: false, // Initialize as false since the exercise isn't completed yet
  };
};

export const findFirstIncompleteExercise = (exercises: ExerciseElement[]) => {
  return exercises?.find((item: ExerciseElement) => !item?.isCompleted);
};

export const getTotalDurationTaken = (workoutSessionExercises: ExerciseElement[]) => {
  let totalDurationTaken = 0;
  for (let i = 0; i < workoutSessionExercises.length; i++) {
    if (workoutSessionExercises?.[i]?.durationTaken) {
      totalDurationTaken += workoutSessionExercises[i]?.duration;
    }
  }
  return totalDurationTaken;
};

type WorkoutSessionStatus = 'FINISHED' | 'PENDING';
export const getStatusColor = (status: WorkoutSessionStatus) => {
  // Check if the status has a corresponding color, otherwise return default text color
  return STATUS_COLORS[status] || 'text-gray-800';
};
