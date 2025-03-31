import { INavbarTabs, ITabItem } from './interfaces';

export const ICON_SIZE = 20;

export const STRING_DATA = {
  SHORT_VERSION: 'Short version',
  REST: 'rest',
  CAMERA: 'Camera',
  GALLERY: 'Gallery',
  BOT_DEFAULT_MESSAGE: `Hi! I'm your personal trainer bot. I'll help you create a customized workout plan. Let's start with a few questions to understand your goals and preferences better.`,
  BOT_REVIEW_MESSAGE: `Please review your answers above. Click "Generate Workout Plan" if you're ready to proceed, or use the back button to make changes.`,
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
  EXTRA_SMALL_DEVICE: 375,
  MOBILE_DEVICE: 500,
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
  // { key: 'my-exercise', value: 'My Exercise', path: '/(tabs)/my-exercise' },
  { key: 'workout-sessions', value: 'Workout Session', path: '/(tabs)/workout-sessions' },
  { key: 'profile', value: 'Profile', path: '/(tabs)/profile' },
];

export const REACT_QUERY_API_KEYS = {
  PUBLIC_WORKOUT: 'public-workouts',
  MY_WORKOUT: 'my-workouts',
  MY_WORKOUT_DETAILS: 'my-workout-details',
  PUBLIC_WORKOUT_DETAILS: 'public-workout-details',
  MY_EXERCISES: 'my-exercises',
  PUBLIC_EXERCISES: 'public-exercises',
  WORKOUT_SESSION_USER: 'workout-session-user',
  WORKOUT_SESSION_USER_DETAILS: 'workout-session-user-details',
  ME: 'me',
};

export const REACT_QUERY_STALE_TIME = {
  PUBLIC_WORKOUT: 1000 * 60, // 10 minutes
  MY_WORKOUT: 1000 * 60, // 10 minutes
  MY_WORKOUT_DETAILS: 1000 * 60, // 1 minute
  PUBLIC_WORKOUT_DETAILS: 0, // 1 minute
  MY_EXERCISES: 1000 * 60, // 1 minutes
  PUBLIC_EXERCISES: 1000 * 60 * 10, // 10 minutes
};

export const STORAGES_KEYS = {
  WORKOUT_SESSION_LIST: 'workout-session-list',
  WORKOUT_SESSION: 'workout-session',
  WORKOUTS_LIST: 'workouts-list',
  WORKOUT_EXERCISES: 'workout-exercises',
};

export const STORAGE_EMITTER_KEYS = {
  REFRESH_WORKOUT_LIST: 'refresh-workout-list',
  REFRESH_WORKOUT_DETAILS: 'refresh-workout-details',
  REFRESH_WORKOUT_DETAILS_EXERCISES: 'refresh-workout-details-exercises',
};

export const WORKOUT_STATUS = {
  FINISHED: 'FINISHED',
  COMPLETED: 'COMPLETED',
  IN_PROGRESS: 'IN_PROGRESS',
  NOT_STARTED: 'NOT_STARTED',
  PENDING: 'PENDING',
};

export const STATUS_COLORS = {
  PENDING: { text: 'text-[#fff', background: 'bg-[#B78A0F]' },
  COMPLETED: { text: 'text-[#fff', background: 'bg-[#A27DE1]' },
  FINISHED: { text: 'text-[#fff', background: 'bg-[#A27DE1]' },
};
