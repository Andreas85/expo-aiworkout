import Container from '@/components/atoms/Container';
import { Text, View } from '@/components/Themed';
import { useFetchData } from '@/hooks/useFetchData';
import { tailwind } from '@/utils/tailwind';
import { ScrollView } from 'react-native';

export default function HomeIndexPage() {
  const { data, error, isPending } = useFetchData({
    queryFn: async () => {
      const response = await fetch('https://fakestoreapi.com/products');
      return await response.json();
    },
    queryKey: ['todo'],
  });

  if (isPending) return <Text>Loading...</Text>;

  if (error) return <Text>An error has occurred: + {error.message}</Text>;

  return (
    <View style={tailwind('h-full')}>
      <ScrollView>
        <Container style={tailwind('flex-1 gap-y-4')} className="flex flex-1 flex-col gap-2">
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
        <Container className="flex-1 flex-col gap-4">
          <Text>{JSON.stringify(data)}</Text>
          <Text>{JSON.stringify(data)}</Text>
        </Container>
      </ScrollView>
    </View>
  );
}
