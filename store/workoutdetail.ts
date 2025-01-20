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
  remainingTime?: number;
  isWorkoutSessionDetailScreenTimerPaused?: boolean;
  isWorkoutSessionDetailScreen?: boolean;
};

type Action = {
  setWorkoutDetail: (payload: State['workoutDetail']) => void;
  setLoadingWorkout: (payload: boolean) => void;
  updateWorkoutExercises: (payload: ExerciseElement[]) => void;
  updateWorkoutTimer: (payload: boolean) => void;
  updateWorkoutCompleted: (payload: boolean) => void;
  updateTotalWorkoutTime: (payload: number) => void;
  updateRemainingTime: (payload: number) => void;

  updateExercisePropertyZustand: (
    exerciseIndex: number,
    property: keyof ExerciseElement,
    value: any,
  ) => void;
  updateIsWorkoutSessionDetailScreenTimerPaused: (payload: boolean) => void;
  updateWorkoutStatusInZustandStore: (payload: 'pending' | 'completed') => void;
  updateWorkoutSessionDetailScreen: (payload: boolean) => void;
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
    remainingTime: 0,
    isWorkoutSessionDetailScreenTimerPaused: false,
    isWorkoutSessionDetailScreen: false,
    setWorkoutDetail: async payload => {
      if (payload) {
        const sortedExercisesList = _.sortBy(payload.exercises, ['order']); // Sort exercises
        const totalWorkoutTime = calculateTotalDuration(sortedExercisesList); // Calculate total workout time
        set({
          workoutDetail: { ...payload, exercises: sortedExercisesList },
          hasExercise: sortedExercisesList.length > 0,
          totalWorkoutTime,
          remainingTime: totalWorkoutTime,
          isWorkoutCompleted: false,
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

    // update total workout time
    updateTotalWorkoutTime: async (payload: number) => {
      set({ totalWorkoutTime: payload });
    },

    updateRemainingTime: async (payload: number) => {
      set({ remainingTime: payload });
    },

    // Function to update exercise properties in the store
    updateExercisePropertyZustand: (exerciseIndex, property, value) =>
      set((state: any) => {
        const updatedExercises = [...state.workoutDetail.exercises];
        if (updatedExercises[exerciseIndex]) {
          updatedExercises[exerciseIndex] = {
            ...updatedExercises[exerciseIndex],
            [property]: value,
          }; // Update the exercise property by index
        }
        console.log('Updated exercises', updatedExercises[exerciseIndex]);
        return {
          workoutDetail: { ...state.workoutDetail, exercises: updatedExercises },
        };
      }),

    updateIsWorkoutSessionDetailScreenTimerPaused: async (payload: any) => {
      set({ isWorkoutSessionDetailScreenTimerPaused: payload });
    },

    updateWorkoutStatusInZustandStore: async (payload: 'pending' | 'completed') => {
      if (payload) {
        set((state: any) => ({
          workoutDetail: { ...state?.workoutDetail, status: payload },
        }));
      }
    },

    updateWorkoutSessionDetailScreen: async (payload: any) => {
      set({ isWorkoutSessionDetailScreen: payload });
    },
  })),
);
