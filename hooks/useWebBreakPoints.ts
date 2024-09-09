import { BREAK_POINTS } from '@/utils/appConstants';
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

export default function useWebBreakPoints() {
  // Initialize width based on web platform or default value for other platforms
  const [width, setWidth] = useState(
    Platform.OS === 'web' ? window.innerWidth : BREAK_POINTS.SMALL_DEVICE,
  );

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Add resize listener for web
      const handleResize = () => {
        setWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup the event listener on unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  // Calculate breakpoints based on current width
  const isLargeScreen = width < BREAK_POINTS.EXTRA_DEVICE;
  const isMediumScreen = width < BREAK_POINTS.LARGE_DEVICE;
  const isSmallScreen = width < BREAK_POINTS.MEDIUM_DEVICE;

  return {
    isLargeScreen,
    isMediumScreen,
    isSmallScreen,
    width, // Return the current width for debugging or further logic
  };
}
