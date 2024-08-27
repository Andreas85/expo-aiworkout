import Container from '@/components/atoms/Container';
import { Text } from '@/components/Themed';
import { tailwind } from '@/utils/tailwind';

export default function HomeIndexPage() {
  return (
    <Container style={tailwind('gap-y-4')} className="flex flex-col gap-2">
      <Container
        style={tailwind('flex h-14 gap-y-4')}
        className="flex items-center justify-between">
        <Text
          style={tailwind(
            'text-center text-3xl font-bold capitalize not-italic leading-10 text-white',
          )}>
          Public workout
        </Text>
        <Container>
          <Text>Version</Text>
        </Container>
      </Container>
      <Container style={tailwind('border border-white')} className="border border-white" />
    </Container>
  );
}
