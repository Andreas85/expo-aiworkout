import Container from '@/components/atoms/Container';
import GradientBackground from '@/components/atoms/GradientBackground';
import TextContainer from '@/components/atoms/TextContainer';
import { tailwind } from '@/utils/tailwind';
import { ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WorkoutSessionScreen() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={[tailwind('flex-1'), { marginTop: insets.top }]}>
      <GradientBackground>
        <ScrollView
          contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Container>
            <TextContainer data={'Workout session'} />
          </Container>
        </ScrollView>
      </GradientBackground>
    </SafeAreaView>
  );
}
