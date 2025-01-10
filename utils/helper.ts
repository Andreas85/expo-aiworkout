import { QueryClient } from '@tanstack/react-query';
import { ERROR_MESSAGE, STRING_DATA } from './appConstants';
import { ExerciseElement } from '@/services/interfaces';

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
    exercises.reduce((totalDuration: any, exercise: { duration: any }) => {
      return totalDuration + exercise.duration;
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
  if (!exercises) {
    return exercises;
  }

  const expandedExercises = [];

  for (const exercise of exercises) {
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

  return expandedExercises;
};

export function generateBigNumberId(): string {
  const randomPart = Math.floor(Math.random() * 1e18); // Generate a large random number
  const timestamp = Date.now(); // Use the current timestamp

  return `${timestamp}${randomPart}`; // Concatenate the timestamp and random part to form a big number string
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
