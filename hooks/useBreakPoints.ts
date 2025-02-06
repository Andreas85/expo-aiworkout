import { BREAK_POINTS } from '@/utils/appConstants';
import { useWindowDimensions } from 'react-native';

export default function useBreakPoints() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width < BREAK_POINTS.EXTRA_DEVICE;
  const isMediumScreen = width < BREAK_POINTS.LARGE_DEVICE;
  const isSmallScreen = width < BREAK_POINTS.MEDIUM_DEVICE;
  const isLargeScreenOnly = width >= BREAK_POINTS.LARGE_DEVICE;
  const isMediumScreenOnly =
    width >= BREAK_POINTS.MEDIUM_DEVICE && width < BREAK_POINTS.LARGE_DEVICE;
  const isSmallScreenOnly =
    width >= BREAK_POINTS.SMALL_DEVICE && width < BREAK_POINTS.MEDIUM_DEVICE;
  const isMobileDevice =
    width >= BREAK_POINTS.EXTRA_SMALL_DEVICE && width < BREAK_POINTS.MOBILE_DEVICE;
  const isExtraSmallDevice = width < BREAK_POINTS.EXTRA_SMALL_DEVICE;

  return {
    isMediumScreen,
    isSmallScreen,
    isLargeScreen,
    isLargeScreenOnly,
    isMediumScreenOnly,
    isSmallScreenOnly,
    isMobileDevice,
    isExtraSmallDevice,
  };
}
