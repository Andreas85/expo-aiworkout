import { Workout } from '@/services/interfaces';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type State = {
  workoutDetail: Workout | null;
  hasExercise: boolean;
};

type Action = {
  setWorkoutDetail: (payload: State['workoutDetail']) => void;
};

export interface IWorkoutDetailStore extends State, Action {}

export const useWorkoutDetailStore = create<IWorkoutDetailStore>()(
  devtools(set => ({
    workoutDetail: null,
    hasExercise: false,
    setWorkoutDetail: async payload => {
      if (payload) {
        set({ workoutDetail: payload, hasExercise: payload.exercises.length > 0 }); // set the workout detail
      }
    },
  })),
);
