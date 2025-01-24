import { ExerciseElement, Workout } from '@/services/interfaces';
import { calculateDurationOFCompleteExercises, calculateTotalDuration } from '@/utils/helper';
import _ from 'lodash';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type State = {
  workoutSessionDetails: Workout | null;
  hasExercises: boolean;
  isLoading?: boolean;
  totalWorkoutTime?: number;
  isWorkoutTimerRunning?: boolean;
  isWorkoutCompleted?: boolean;
  remainingTime?: number;
  isWorkoutSessionDetailScreenTimerPaused?: boolean;
  isWorkoutSessionDetailScreen?: boolean;
  isActiveRepExerciseCard?: boolean;
};

type Action = {
  setWorkoutSessionDetails: (payload: State['workoutSessionDetails']) => void;
  setLoadingWorkoutSession: (payload: boolean) => void;
  updateWorkoutSessionExercises: (payload: ExerciseElement[]) => void;
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
  updateWorkoutStatusInZustandStore: (payload: 'PENDING' | 'FINISHED') => void;
  updateWorkoutSessionDetailsScreen: (payload: boolean) => void;
  updateIsActiveRepExerciseCard?: (payload: boolean) => void;
};

export interface IWorkoutSessionStore extends State, Action {}

export const useWorkoutSessionStore = create<IWorkoutSessionStore>()(
  devtools(set => ({
    workoutSessionDetails: null,
    hasExercises: false,
    isLoading: false,
    totalWorkoutSessionTime: 0,
    isWorkoutTimerRunning: false,
    isWorkoutSessionCompleted: false,
    remainingSessionTime: 0,
    isWorkoutSessionDetailsScreenTimerPaused: false,
    isWorkoutSessionDetailsScreen: false,
    isActiveRepExerciseCard: false,
    setWorkoutSessionDetails: async payload => {
      if (payload) {
        const sortedExercisesList = _.sortBy(payload.exercises, ['order']); // Sort exercises
        const totalWorkoutSessionTime = calculateTotalDuration(sortedExercisesList); // Calculate total workout time
        const durationOFCompleteExercises =
          calculateDurationOFCompleteExercises(sortedExercisesList); // Calculate remaining time
        const remainingSessionTime = totalWorkoutSessionTime - durationOFCompleteExercises;
        console.log('sortedExercisesListsortedExercisesList', sortedExercisesList);
        set({
          workoutSessionDetails: { ...payload, exercises: sortedExercisesList },
          hasExercises: sortedExercisesList.length > 0,
          totalWorkoutTime: totalWorkoutSessionTime,
          remainingTime: remainingSessionTime,
          isWorkoutCompleted: false,
        });
      }
    },
    // set exercises data and sort it based on the order
    updateWorkoutSessionExercises: async (payload: ExerciseElement[]) => {
      if (payload) {
        const sortedExercisesList = _.sortBy(payload, ['order']);
        set((state: any) => ({
          workoutSessionDetails: {
            ...state?.workoutSessionDetails,
            exercises: sortedExercisesList,
          },
          hasExercises: sortedExercisesList.length > 0,
        }));
      }
    },
    setLoadingWorkoutSession: async (payload: any) => {
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

    // Function to update exercise properties in the session store
    updateExercisePropertyZustand: (exerciseIndex, property, value) =>
      set((state: any) => {
        const updatedExercises = [...state.workoutSessionDetails.exercises];
        if (updatedExercises[exerciseIndex]) {
          updatedExercises[exerciseIndex] = {
            ...updatedExercises[exerciseIndex],
            [property]: value,
          }; // Update the exercise property by index
        }
        console.log('Updated exercises', updatedExercises[exerciseIndex]);
        return {
          workoutSessionDetails: { ...state.workoutSessionDetails, exercises: updatedExercises },
        };
      }),

    updateIsWorkoutSessionDetailScreenTimerPaused: async (payload: any) => {
      set({ isWorkoutSessionDetailScreenTimerPaused: payload });
    },

    updateWorkoutStatusInZustandStore: async (payload: 'PENDING' | 'FINISHED') => {
      if (payload) {
        set((state: any) => ({
          workoutSessionDetails: { ...state?.workoutSessionDetails, status: payload },
        }));
      }
    },

    updateWorkoutSessionDetailsScreen: async (payload: any) => {
      set({ isWorkoutSessionDetailScreen: payload });
    },

    updateIsActiveRepExerciseCard: async (payload: any) => {
      set({ isActiveRepExerciseCard: payload });
    },
  })),
);
