import Container from '@/components/atoms/Container';
import GridContainer from '@/components/atoms/GridContainer';
import ImageContainer from '@/components/atoms/ImageContainer';
import Loading from '@/components/atoms/Loading';
import TextContainer from '@/components/atoms/TextContainer';
import { Text } from '@/components/Themed';
import { useFetchData } from '@/hooks/useFetchData';
import { fetchPublicWorkoutService } from '@/services/workouts';
import { tailwind } from '@/utils/tailwind';
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const itemWidth = width / 2 - 32; // Adjust for margins and spacing

export default function HomeIndexPage() {
  const [productData, setProductData] = useState<any[]>([]);
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
      <Container style={tailwind('m-4 flex-1')} className="self-center rounded-lg">
        <ImageContainer
          source={{ uri: item?.image ?? 'https://placehold.co/600x400?font=roboto&text=WORKOUT' }}
          styleNative={[
            tailwind(`z-10 self-center rounded`),
            { width: itemWidth, height: itemWidth },
          ]}
          styleWeb={tailwind('h-64 w-full self-center rounded-lg')}
          contentFit="cover"
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

  return (
    <>
      <Container
        style={tailwind('mb-4 gap-y-4 px-4')}
        className="mb-4 flex w-full flex-1 flex-col gap-2">
        <Container
          style={tailwind('flex h-14 gap-y-4')}
          className="flex items-center justify-between">
          <Text
            style={tailwind(
              'text-center text-3xl font-bold capitalize not-italic leading-10 text-white',
            )}>
            Public workout
          </Text>
          <Container
            style={{ display: 'none' }}
            className="flex w-fit items-center justify-end gap-2 rounded-full bg-WORKOUT_VERSION_BACKGROUND">
            <Container
              className="min-w-fit self-center  rounded-s-full bg-WORKOUT_VERSION_BACKGROUND_ACTIVE p-4"
              style={{
                flex: 1,
                alignItems: 'center',
                // backgroundColor: '#9C79C9',
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
                {'Full version'}
              </Text>
            </Container>
            <Container
              className=" min-w-fit  self-center rounded-s-full p-4"
              style={{
                flex: 1,
                alignItems: 'center',
                backgroundColor: '#9C79C9',
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
            </Container>
          </Container>
        </Container>
        <Container style={tailwind('border border-white')} className="border border-white" />
        <Container
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#493B42',
            borderRadius: 16,
            marginBottom: 2,
          }}
          className="hidden w-fit items-center justify-end gap-2 rounded-full bg-WORKOUT_VERSION_BACKGROUND">
          <Container
            className="self-center rounded-s-full  bg-WORKOUT_VERSION_BACKGROUND_ACTIVE p-4"
            style={{
              flex: 1,
              alignItems: 'center',
              // backgroundColor: '#9C79C9',
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
              {'Full version'}
            </Text>
          </Container>
          <Container
            style={{
              flex: 1,
              alignItems: 'center',
              backgroundColor: '#9C79C9',
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
          </Container>
        </Container>
      </Container>
      {renderWorkingListing()}
    </>
  );
}
