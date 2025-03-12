export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://workout-app-backend1-daaf386ee119.herokuapp.com';

export const API_ENPOINTS = {
  PUBLIC_EXERCISES: '/public/exercises',
  EXERCISES: '/exercises/',
  WORKOUT: '/public/workouts',
  MY_WORKOUT: '/workouts',
  EXERCISE_SEARCH: '/public/exercises/search/',
  REGISTER: '/auth/signup',
  LOGIN: '/auth/send-signin-otp',
  FORGET: '/auth/forgot-password',
  RESET: '/auth/reset-password',
  SIGNIN_USING_OTP: '/auth/signin-using-otp',
  WORKOUT_SESSION: '/workout-sessions',
  ME: '/me',
  WORKOUT_GENERATE: '/workouts/generate',
  SAVE_WORKOUT_GENERATE: '/workouts/save-generated',
};
