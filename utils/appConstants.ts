import { INavbarTabs } from './interfaces';

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
