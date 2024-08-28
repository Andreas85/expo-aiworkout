import Container from '@/components/atoms/Container';
import GridContainer from '@/components/atoms/GridContainer';
import ImageContainer from '@/components/atoms/ImageContainer';
import { Text } from '@/components/Themed';
import { useFetchData } from '@/hooks/useFetchData';
import { tailwind } from '@/utils/tailwind';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const itemWidth = width / 2 - 32; // Adjust for margins and spacing

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

  const renderListItem = (item: any) => {
    return (
      <Container style={tailwind('m-4 flex-1')} className="self-center rounded-lg">
        <ImageContainer
          source={{ uri: item?.image }}
          styleNative={[
            tailwind(`self-center rounded-lg`),
            { width: itemWidth, height: itemWidth },
          ]}
          styleWeb={tailwind('h-64 w-full self-center rounded-lg')}
          resizeMode="cover"
        />
        <Text style={tailwind('self-center')}>{item?.title}</Text>
      </Container>
    );
  };

  return (
    <>
      <Container style={tailwind('gap-y-4 px-4')} className="flex flex-1 flex-col gap-2">
        <Container
          style={tailwind('flex h-14 gap-y-4')}
          className="flex items-center justify-between">
          <Text
            style={tailwind(
              'text-center text-3xl font-bold capitalize not-italic leading-10 text-white',
            )}>
            Public workout
          </Text>
          <Text>Version</Text>
        </Container>
        <Container style={tailwind('border border-white')} className="border border-white" />
      </Container>
      <GridContainer
        data={data}
        listNumColumns={2}
        style={tailwind('flex-1 bg-blue-600')}
        renderListItemInNative={renderListItem}
        className="my-4 grid grid-cols-2 gap-4  md:grid-cols-3 lg:grid-cols-4">
        {data.map((item: any, index: number) => {
          return <Container key={index}>{renderListItem(item)}</Container>;
        })}
      </GridContainer>
    </>
  );
}
