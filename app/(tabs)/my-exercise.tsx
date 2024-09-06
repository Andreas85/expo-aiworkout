import Container from '@/components/atoms/Container';
import GradientBackground from '@/components/atoms/GradientBackground';
import NoDataSvg from '@/components/svgs/NoDataSvg';
import { tailwind } from '@/utils/tailwind';
import { ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MyExerciseScreen() {
  const insets = useSafeAreaInsets();
  // const { isAuthenticated } = useAuthStore();
  return (
    <SafeAreaView style={[tailwind('flex-1'), { marginTop: insets.top }]}>
      <GradientBackground>
        <ScrollView
          contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Container>
            <NoDataSvg label="No exercises " />
          </Container>
        </ScrollView>
      </GradientBackground>
    </SafeAreaView>
  );
}
