import { INavbarTabs, ITabItem } from './interfaces';

export const STRING_DATA = {
  SHORT_VERSION: 'Short version',
};

export const NAVBAR_TABS: INavbarTabs[] = [
  { path: '/', label: '' },
  { path: '/my-exercise', label: 'My exercise' },
  { path: '/workout-session', label: 'Workout session' },
  { path: '/profile', label: 'Profile' },
];

export const ERROR_MESSAGE = {
  SOMETHING_WENT_WRONG: 'Something went wront',
};

export const USER_ROLE = {
  ADMIN: 'ADMIN',
};

export const BREAK_POINTS = {
  SMALL_DEVICE: 640,
  MEDIUM_DEVICE: 768,
  LARGE_DEVICE: 1024,
  EXTRA_DEVICE: 1280,
};

export const WORKOUT_TABS: ITabItem[] = [
  {
    key: 'my_workout',
    value: 'My workout',
    path: '/(tabs)/(workout)/workouts',
  },
  {
    key: 'public_workout',
    value: 'Public workout',
    path: '/(tabs)/(workout)/workouts/public',
  },
];

export const headerOptions: ITabItem[] = [
  { key: 'workout', value: 'Workout', path: '/(tabs)/(workout)/workouts' },
  { key: 'my-exercise', value: 'My Exercise', path: '/(tabs)/my-exercise' },
  { key: 'workout-session', value: 'Workout Session', path: '/(tabs)/workout-session' },
  { key: 'profile', value: 'Profile', path: '/(tabs)/profile' },
];

export const REACT_QUERY_API_KEYS = {
  PUBLIC_WORKOUT: 'public-workouts',
  MY_WORKOUT: 'my-workouts',
  MY_WORKOUT_DETAILS: 'my-workout-details',
  PUBLIC_WORKOUT_DETAILS: 'public-workout-details',
};
