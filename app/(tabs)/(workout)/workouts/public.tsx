import GradientBackground from '@/components/atoms/GradientBackground';
import PublicWorkout from '@/components/screens/PublicWorkout';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { useAuthStore } from '@/store/authStore';
import { tailwind } from '@/utils/tailwind';
import { Platform } from 'react-native';

export default function PublicScreenRoute() {
  const { isAuthenticated } = useAuthStore();
  const { isLargeScreen } = useWebBreakPoints();
  return (
    <GradientBackground
      styleWeb="!mt-0"
      styleNative={[
        Platform.select({
          web: tailwind(`${!isLargeScreen && !isAuthenticated ? 'mt-24' : ''} flex-1`),
          native: tailwind('flex-1'),
        }),
      ]}>
      <PublicWorkout />
    </GradientBackground>
  );
}
