import { ICommonPromts } from '@/components/modals/GenerateWorkoutModal';
import { INavbarTabs, ITabItem } from './interfaces';

export const ICON_SIZE = 20;

export const STRING_DATA = {
  SHORT_VERSION: 'Short version',
  REST: 'rest',
  CAMERA: 'Camera',
  GALLERY: 'Gallery',
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
  { key: 'my-exercise', value: 'My Exercise', path: '/(tabs)/my-exercise' },
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

export const COMMON_PROMTPS: ICommonPromts[] = [
  {
    id: 1,
    name: 'Upper Body Strength Builder',
    workout: [
      { exercise_name: 'Push-Ups', reps: 15, duration: 0, weight: 0, rest: 30 },
      { exercise_name: 'Push-Ups', reps: 15, duration: 0, weight: 0, rest: 30 },
      { exercise_name: 'Push-Ups', reps: 15, duration: 0, weight: 0, rest: 30 },
      { exercise_name: 'Pull-Ups', reps: 10, duration: 0, weight: 0, rest: 45 },
      { exercise_name: 'Pull-Ups', reps: 10, duration: 0, weight: 0, rest: 45 },
      { exercise_name: 'Dumbbell Bench Press', reps: 12, duration: 0, weight: 20, rest: 60 },
      { exercise_name: 'Dumbbell Bench Press', reps: 12, duration: 0, weight: 20, rest: 60 },
    ],
  },
  {
    id: 2,
    name: 'Full Body HIIT Blast',
    workout: [
      { exercise_name: 'Burpees', reps: 20, duration: 0, weight: 0, rest: 30 },
      { exercise_name: 'Burpees', reps: 20, duration: 0, weight: 0, rest: 30 },
      { exercise_name: 'Mountain Climbers', reps: 30, duration: 0, weight: 0, rest: 30 },
      { exercise_name: 'Mountain Climbers', reps: 30, duration: 0, weight: 0, rest: 30 },
      { exercise_name: 'Jump Squats', reps: 15, duration: 0, weight: 0, rest: 45 },
      { exercise_name: 'Jump Squats', reps: 15, duration: 0, weight: 0, rest: 45 },
    ],
  },
  {
    id: 3,
    name: 'Core Strength & Abs Sculptor',
    workout: [
      { exercise_name: 'Plank Hold', reps: 0, duration: 60, weight: 0, rest: 30 },
      { exercise_name: 'Plank Hold', reps: 0, duration: 60, weight: 0, rest: 30 },
      { exercise_name: 'Russian Twists', reps: 20, duration: 0, weight: 5, rest: 30 },
      { exercise_name: 'Russian Twists', reps: 20, duration: 0, weight: 5, rest: 30 },
      { exercise_name: 'Hanging Leg Raises', reps: 15, duration: 0, weight: 0, rest: 45 },
      { exercise_name: 'Hanging Leg Raises', reps: 15, duration: 0, weight: 0, rest: 45 },
    ],
  },
  {
    id: 4,
    name: 'Lower Body Power & Strength',
    workout: [
      { exercise_name: 'Barbell Squats', reps: 15, duration: 0, weight: 50, rest: 60 },
      { exercise_name: 'Barbell Squats', reps: 15, duration: 0, weight: 50, rest: 60 },
      { exercise_name: 'Walking Lunges', reps: 12, duration: 0, weight: 10, rest: 45 },
      { exercise_name: 'Walking Lunges', reps: 12, duration: 0, weight: 10, rest: 45 },
      { exercise_name: 'Romanian Deadlifts', reps: 10, duration: 0, weight: 40, rest: 90 },
      { exercise_name: 'Romanian Deadlifts', reps: 10, duration: 0, weight: 40, rest: 90 },
    ],
  },
];
