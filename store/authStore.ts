import { User } from '@/services/interfaces';
import { USER_ROLE } from '@/utils/appConstants';
import { STORE_KEY } from '@/utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type State = {
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean | null;
  userData: User | null; // update type
};

type Action = {
  setTokenInStore: (payload: State['token']) => void;
  clearTokenFromStore: () => void;
  setUserData: (user: User) => void;
  setAuthTokenAndUser: (payload: { token: string; user: User }) => void;
};

export interface IAuthStore extends State, Action {}

export const useAuthStore = create<IAuthStore>()(
  devtools(set => ({
    token: null,
    isAuthenticated: false,
    userData: null,
    isAdmin: false,
    setTokenInStore: async newToken => {
      if (newToken) {
        await AsyncStorage.setItem(STORE_KEY, newToken);
        set({ token: newToken, isAuthenticated: true });
      }
    },
    setAuthTokenAndUser: async (payload: { token: string; user: User }) => {
      const { token: newToken, user } = payload;
      await AsyncStorage.setItem(STORE_KEY, JSON.stringify(payload));
      set({
        token: newToken,
        isAuthenticated: true,
        userData: user,
        isAdmin: user?.roles?.includes(USER_ROLE.ADMIN),
      });
    },
    clearTokenFromStore: async () => {
      await AsyncStorage.removeItem(STORE_KEY);
      set({ token: null, isAuthenticated: false, isAdmin: null, userData: null });
    },

    setUserData: (user: User) => set({ userData: user }),
  })),
);
// Load token from AsyncStorage (e.g., during app startup)
if (typeof window !== 'undefined') {
  (async () => {
    try {
      const storeData = await AsyncStorage.getItem(STORE_KEY);
      const data = storeData ? JSON.parse(storeData) : { user: null, token: null };
      if (storeData) {
        const { token, user } = data;
        useAuthStore.setState({
          token: token,
          isAuthenticated: true,
          userData: user,
          isAdmin: user?.roles?.includes(USER_ROLE.ADMIN),
        });
      }
    } catch (error) {
      useAuthStore.setState({ token: null, isAuthenticated: false });
      console.error('Error loading auth token:', error);
    }
  })();
}
