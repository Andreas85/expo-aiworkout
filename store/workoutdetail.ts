import { ExerciseElement, Workout } from '@/services/interfaces';
import _ from 'lodash';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type State = {
  workoutDetail: Workout | null;
  hasExercise: boolean;
  isLoading?: boolean;
};

type Action = {
  setWorkoutDetail: (payload: State['workoutDetail']) => void;
  setLoadingWorkout: (payload: boolean) => void;
  updateWorkoutExercises: (payload: ExerciseElement[]) => void;
};

export interface IWorkoutDetailStore extends State, Action {}

export const useWorkoutDetailStore = create<IWorkoutDetailStore>()(
  devtools(set => ({
    workoutDetail: null,
    hasExercise: false,
    isLoading: false,
    setWorkoutDetail: async payload => {
      if (payload) {
        const sortedExercisesList = _.sortBy(payload.exercises, ['order']); // Sort exercises
        set({
          workoutDetail: { ...payload, exercises: sortedExercisesList },
          hasExercise: sortedExercisesList.length > 0,
        });
      }
    },
    // set exercises data and sort it based on the order
    updateWorkoutExercises: async (payload: ExerciseElement[]) => {
      if (payload) {
        const sortedExercisesList = _.sortBy(payload, ['order']);
        set((state: any) => ({
          workoutDetail: { ...state?.workoutDetail, exercises: sortedExercisesList },
          hasExercise: sortedExercisesList.length > 0,
        }));
      }
    },
    setLoadingWorkout: async (payload: any) => {
      set({ isLoading: payload });
    },
  })),
);
