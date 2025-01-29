import Container from '@/components/atoms/Container';
import GradientBackground from '@/components/atoms/GradientBackground';
import NoDataSvg from '@/components/svgs/NoDataSvg';
import { tailwind } from '@/utils/tailwind';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyExerciseScreen() {
  return (
    <SafeAreaView style={[tailwind('flex-1')]}>
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
