import { WorkoutPlan } from '@/types';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type State = {
  generatedWorkoutPlan: WorkoutPlan | null;
};

type Action = {
  setGeneratedWorkoutPlan: (payload: State['generatedWorkoutPlan']) => void;
};

export interface IWorkoutDetailStore extends State, Action {}

export const useGenerateWorkoutPlanStore = create<IWorkoutDetailStore>()(
  devtools(set => ({
    generatedWorkoutPlan: null,
    setGeneratedWorkoutPlan: async payload => {
      set({
        generatedWorkoutPlan: payload,
      });
    },
  })),
);
