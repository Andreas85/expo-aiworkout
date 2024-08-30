import Container from '@/components/atoms/Container';
import GradientBackground from '@/components/atoms/GradientBackground';
import TextContainer from '@/components/atoms/TextContainer';
import { tailwind } from '@/utils/tailwind';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MyExerciseScreen() {
  const insets = useSafeAreaInsets();
  // const { isAuthenticated } = useAuthStore();
  return (
    <SafeAreaView style={[tailwind('flex-1'), { marginTop: insets.top }]}>
      <GradientBackground>
        <Container>
          <TextContainer data={'My exercise'} />
        </Container>
      </GradientBackground>
    </SafeAreaView>
  );
}
