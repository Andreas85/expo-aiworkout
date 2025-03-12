import { useMemo } from 'react';
import { Platform } from 'react-native';

const usePlatform = () => {
  const platform = useMemo(() => Platform.OS, []);
  const isIOS = platform === 'ios';
  const isAndroid = platform === 'android';
  const isWeb = platform === 'web';

  return {
    platform,
    isIOS,
    isAndroid,
    isWeb,
  };
};

export default usePlatform;
