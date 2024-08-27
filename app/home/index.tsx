import Container from '@/components/atoms/Container';
import { Text, View } from '@/components/Themed';
import { useFetchData } from '@/hooks/useFetchData';
import { tailwind } from '@/utils/tailwind';
import { Image, ScrollView } from 'react-native';

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
    <View style={tailwind('h-full bg-transparent')}>
      <ScrollView>
        <Container style={tailwind(' gap-y-4')} className="flex flex-1 flex-col gap-2">
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
        <Container
          style={tailwind('gap-y-2 ')}
          className="my-4 grid grid-cols-2 gap-4  md:grid-cols-3 lg:grid-cols-4">
          {data.map((item: any, index: number) => {
            return (
              <Container key={index} style={tailwind('')} className="self-center rounded-lg ">
                <Image source={{ uri: item?.image }} style={tailwind('h-64 w-full rounded-lg')} />
                <Text style={tailwind('self-center text-center')}>{item?.title?.slice(0, 25)}</Text>
              </Container>
            );
          })}
        </Container>
      </ScrollView>
    </View>
  );
}
