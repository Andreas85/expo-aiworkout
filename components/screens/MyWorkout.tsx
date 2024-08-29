import Container from '@/components/atoms/Container';
import GridContainer from '@/components/atoms/GridContainer';
import ImageContainer from '@/components/atoms/ImageContainer';
import Loading from '@/components/atoms/Loading';
import TextContainer from '@/components/atoms/TextContainer';
import { Text, View } from '@/components/Themed';
import { useFetchData } from '@/hooks/useFetchData';
import { fetchPublicWorkoutService } from '@/services/workouts';
import { useAuthStore } from '@/store/authStore';
import { tailwind } from '@/utils/tailwind';
import { useEffect, useState } from 'react';
import { Dimensions, Platform, Pressable } from 'react-native';

const { width } = Dimensions.get('window');
const itemWidth = width / 2 - 32; // Adjust for margins and spacing

export default function MyWorkout() {
  const { isAuthenticated } = useAuthStore();
  const [productData, setProductData] = useState<any[]>([]);
  const [selectedVersion, setSelectedVersion] = useState('full');
  const { data, error, isPending } = useFetchData({
    queryFn: async () => await fetchPublicWorkoutService(),
    queryKey: ['workouts'],
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      setProductData(data?.data);
    }
  }, [data]);

  const renderListItem = (item: any) => {
    return (
      <Container style={tailwind('mx-4 flex-1')} className="self-center rounded-lg">
        <ImageContainer
          source={{ uri: item?.image ?? 'https://placehold.co/600x400?font=roboto&text=WORKOUT' }}
          styleNative={[
            tailwind(`z-10 self-center rounded`),
            { width: itemWidth, height: itemWidth },
          ]}
          styleWeb={tailwind('h-64 w-full self-center rounded-lg')}
          contentFit="contain"
        />
        <TextContainer data={item?.name} style={tailwind('self-center')} className="text-center" />
      </Container>
    );
  };

  const renderWorkingListing = () => {
    if (isPending) {
      return <Loading />;
    }
    if (error) return <Text>An error has occurred: + {error.message}</Text>;
    return (
      <GridContainer
        data={productData}
        listNumColumnsNative={2}
        keyExtractorNative={item => item?._id}
        renderListItemInNative={renderListItem}
        className="grid grid-cols-2 gap-12  md:grid-cols-3 lg:grid-cols-4">
        {productData?.map((item: any, index: number) => {
          return <Container key={`web_${index}`}>{renderListItem(item)}</Container>;
        })}
      </GridContainer>
    );
  };

  const renderTopHeader = () => {
    if (isAuthenticated) {
      return (
        <Container
          style={[tailwind('mb-4 flex-1 gap-y-24')]}
          className="mb-4 flex w-full flex-1 flex-col gap-2">
          <>
            <Container
              style={tailwind('flex h-14 gap-y-4')}
              className="flex items-center justify-between">
              <Text
                style={tailwind(
                  'text-center text-3xl font-bold capitalize not-italic leading-10 text-white',
                )}>
                Public workout
              </Text>
              {renderVersionTab()}
            </Container>
            <Container style={tailwind('border border-white')} className="border border-white" />
          </>
        </Container>
      );
    }
    return null;
  };

  const renderVersionTab = () => {
    return (
      <View
        style={Platform.select({
          native: tailwind(
            'bg-WORKOUT_VERSION_BACKGROUND my-4 flex-row items-center justify-between rounded-2xl',
          ),
          web: tailwind(
            'bg-WORKOUT_VERSION_BACKGROUND my-4 ml-auto w-72 flex-row items-center justify-end rounded-2xl',
          ),
        })}>
        <Pressable style={tailwind('flex-1')} onPress={() => setSelectedVersion('full')}>
          <View
            // className="bg-WORKOUT_VERSION_BACKGROUND_ACTIVE self-center  rounded-s-full p-4"
            style={{
              // flex: 1,
              alignItems: 'center',
              backgroundColor: selectedVersion === 'full' ? '#9C79C9' : 'transparent',
              borderColor: '#00000008',
              borderRadius: 16,
              borderWidth: 1,
              paddingVertical: 16,
              // margin: 4,
            }}>
            <Text style={tailwind('text-white')}>{'Full version'}</Text>
          </View>
        </Pressable>
        <Pressable style={tailwind('flex-1 grow')} onPress={() => setSelectedVersion('short')}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: selectedVersion === 'short' ? '#9C79C9' : 'transparent',
              borderColor: '#00000008',
              borderRadius: 16,
              borderWidth: 1,
              paddingVertical: 16,
            }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 13,
              }}>
              {'Short version'}
            </Text>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <Container style={tailwind('flex-1 p-4')}>
      {renderTopHeader()}
      {renderVersionTab()}
      {renderWorkingListing()}
    </Container>
  );
}
