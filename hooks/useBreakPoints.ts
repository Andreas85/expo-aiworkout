import { BREAK_POINTS } from '@/utils/appConstants';
import { useWindowDimensions } from 'react-native';

export default function useBreakPoints() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width < BREAK_POINTS.EXTRA_DEVICE;
  const isMediumScreen = width < BREAK_POINTS.LARGE_DEVICE;
  const isSmallScreen = width < BREAK_POINTS.MEDIUM_DEVICE;
  return {
    isMediumScreen,
    isSmallScreen,
    isLargeScreen,
  };
}
