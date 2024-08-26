import { STORE_KEY } from '@/utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type State = {
  token: string | null;
  isAuthenticated: boolean;
};

type Action = {
  setTokenInStore: (payload: State['token']) => void;
  clearTokenFromStore: () => void;
};

export interface IAuthStore extends State, Action {}

export const useAuthStore = create<IAuthStore>()(
  devtools(set => ({
    token: null,
    isAuthenticated: false,
    setTokenInStore: async newToken => {
      if (newToken) {
        await AsyncStorage.setItem(STORE_KEY, newToken);
        set({ token: newToken, isAuthenticated: true });
      }
    },
    clearTokenFromStore: async () => {
      await AsyncStorage.removeItem(STORE_KEY);
      set({ token: null, isAuthenticated: false });
    },
  })),
);
// Load token from AsyncStorage (e.g., during app startup)
if (typeof window !== 'undefined') {
  (async () => {
    try {
      const storedToken = await AsyncStorage.getItem(STORE_KEY);
      if (storedToken) {
        useAuthStore.setState({ token: storedToken, isAuthenticated: true });
      }
    } catch (error) {
      useAuthStore.setState({ token: null, isAuthenticated: false });
      console.error('Error loading auth token:', error);
    }
  })();
}
