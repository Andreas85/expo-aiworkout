import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type State = {
  isSyncing: boolean;
  progressMessage: string;
  completed: number;
  total: number;
  error: string | null;
};

type Action = {
  startSync: (total: number) => void;
  updateProgress: (message: string, completed: number) => void;
  setError: (error: string) => void;
  finishSync: () => void;
};

export interface ISyncDataStore extends State, Action {}

export const useSyncDataStore = create<ISyncDataStore>()(
  devtools(set => ({
    isSyncing: false,
    progressMessage: '',
    completed: 0,
    total: 0,
    error: null,
    startSync: total =>
      set({
        isSyncing: true,
        progressMessage: 'Starting sync...',
        completed: 0,
        total,
        error: null,
      }),
    updateProgress: (message, completed) =>
      set(state => ({
        progressMessage: message,
        completed,
      })),
    setError: error =>
      set({
        isSyncing: false,
        error,
      }),
    finishSync: () =>
      set({
        isSyncing: false,
        progressMessage: 'Sync complete!',
        completed: 0,
        total: 0,
        error: null,
      }),
  })),
);
