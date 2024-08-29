import Container from '@/components/atoms/Container';
import GradientBackground from '@/components/atoms/GradientBackground';
import TextContainer from '@/components/atoms/TextContainer';

export default function WorkoutSessionScreen() {
  return (
    <GradientBackground>
      <Container>
        <TextContainer data={'Workout session'} />
      </Container>
    </GradientBackground>
  );
}
