import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type State = {
  hasInteracted: boolean;
  muted: boolean;
};

type Action = {
  setHasInteracted: (payload: boolean) => void;
  updateMuted: (payload: boolean) => void;
};

export interface IAuthStore extends State, Action {}

export const interactionStore = create<IAuthStore>()(
  devtools(set => ({
    hasInteracted: false,
    muted: false,
    setHasInteracted: async (payload: boolean) => {
      set({ hasInteracted: payload });
    },
    updateMuted: async (payload: boolean) => {
      set({ muted: payload });
    },
  })),
);
