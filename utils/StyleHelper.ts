import { Platform } from 'react-native';
import { tailwind } from './tailwind';

export const StyleHelper = {
  testInputStyle: Platform.select({
    web: tailwind('border-b border-b-white'),
    native: tailwind('border-b border-b-white'),
  }),
};
