import Container from '@/components/atoms/Container';
import GradientBackground from '@/components/atoms/GradientBackground';
import TextContainer from '@/components/atoms/TextContainer';

export default function MyExerciseScreen() {
  return (
    <GradientBackground>
      <Container>
        <TextContainer data={'My exercise'} />
      </Container>
    </GradientBackground>
  );
}
