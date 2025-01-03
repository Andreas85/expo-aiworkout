import { ExerciseElement, Workout } from '@/services/interfaces';
import { calculateTotalDuration } from '@/utils/helper';
import _ from 'lodash';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type State = {
  workoutDetail: Workout | null;
  hasExercise: boolean;
  isLoading?: boolean;
  totalWorkoutTime?: number;
  isWorkoutTimerRunning?: boolean;
  isWorkoutCompleted?: boolean;
};

type Action = {
  setWorkoutDetail: (payload: State['workoutDetail']) => void;
  setLoadingWorkout: (payload: boolean) => void;
  updateWorkoutExercises: (payload: ExerciseElement[]) => void;
  updateWorkoutTimer: (payload: boolean) => void;
  updateWorkoutCompleted: (payload: boolean) => void;
};

export interface IWorkoutDetailStore extends State, Action {}

export const useWorkoutDetailStore = create<IWorkoutDetailStore>()(
  devtools(set => ({
    workoutDetail: null,
    hasExercise: false,
    isLoading: false,
    totalWorkoutTime: 0,
    isWorkoutTimerRunning: false,
    isWorkoutCompleted: false,
    setWorkoutDetail: async payload => {
      if (payload) {
        const sortedExercisesList = _.sortBy(payload.exercises, ['order']); // Sort exercises
        const totalWorkoutTime = calculateTotalDuration(sortedExercisesList); // Calculate total workout time
        set({
          workoutDetail: { ...payload, exercises: sortedExercisesList },
          hasExercise: sortedExercisesList.length > 0,
          totalWorkoutTime,
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

    updateWorkoutTimer: async (payload: any) => {
      set({ isWorkoutTimerRunning: payload });
    },

    updateWorkoutCompleted: async (payload: any) => {
      set({ isWorkoutCompleted: payload });
    },
  })),
);
