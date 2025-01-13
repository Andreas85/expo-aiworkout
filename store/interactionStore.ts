import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type State = {
  hasInteracted: boolean;
};

type Action = {
  setHasInteracted: (payload: boolean) => void;
};

export interface IAuthStore extends State, Action {}

export const interactionStore = create<IAuthStore>()(
  devtools(set => ({
    hasInteracted: false,
    setHasInteracted: async (payload: boolean) => {
      set({ hasInteracted: payload });
    },
  })),
);
