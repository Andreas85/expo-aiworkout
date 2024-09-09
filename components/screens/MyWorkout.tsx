import Container from '@/components/atoms/Container';
import GridContainer from '@/components/atoms/GridContainer';
import ImageContainer from '@/components/atoms/ImageContainer';
import Loading from '@/components/atoms/Loading';
import TextContainer from '@/components/atoms/TextContainer';
import { Text, View } from '@/components/Themed';
import useBreakPoints from '@/hooks/useBreakPoints';
import { useFetchData } from '@/hooks/useFetchData';
import { fetchPublicWorkoutService } from '@/services/workouts';
import { useAuthStore } from '@/store/authStore';
import { tailwind } from '@/utils/tailwind';
import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { ActionButton } from '../atoms/ActionButton';
import { AntDesign } from '@expo/vector-icons';
import { IMAGES } from '@/utils/images';

export default function MyWorkout() {
  const { isAuthenticated } = useAuthStore();
  const [productData, setProductData] = useState<any[]>([]);
  const [selectedVersion, setSelectedVersion] = useState('full');
  const { isSmallScreen, isLargeScreen } = useBreakPoints();

  // Function to handle refresh action
  const onRefresh = async () => {
    await refetch();
  };
  const { data, error, isPending, refetch } = useFetchData({
    queryFn: async () => await fetchPublicWorkoutService(),
    queryKey: ['workouts'],
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      setProductData(data?.data);
    }
  }, [data]);

  const renderListItem = (item: any, index: number) => {
    if (item?.isPlaceholder) {
      return <Container style={tailwind(`relative h-full w-full flex-1`)}></Container>;
    }
    return (
      <Container style={tailwind('relative h-full w-full flex-1 grow self-center')}>
        <ImageContainer
          source={IMAGES.logo}
          styleNative={[tailwind(`aspect-video  w-full  self-center rounded`)]}
          contentFit="contain"
        />
        <TextContainer data={item?.name} style={tailwind('h-full w-full flex-1 text-center ')} />
      </Container>
    );
  };

  const renderWorkingListing = () => {
    if (isPending) {
      return <Loading />;
    }
    if (error) return <Text>An error has occurred: + {error.message}</Text>;
    // Ensure bracketPrediction is iterable
    const iterableProductData = Array.isArray(productData) ? productData : [];

    // Calculate how many placeholders are needed to make length a multiple of 4
    const placeholdersNeeded =
      iterableProductData.length % 4 === 0 ? 0 : 4 - (iterableProductData.length % 4);

    // Add placeholders to fill the grid evenly
    const adjustedData = [
      ...iterableProductData,
      ...Array(placeholdersNeeded).fill({ isPlaceholder: true }),
    ];
    return (
      <GridContainer
        data={adjustedData}
        renderListHeaderComponent={renderTopHeader}
        refreshingNative={isPending}
        onRefresh={onRefresh}
        listNumColumnsNative={isSmallScreen ? 2 : 4}
        keyExtractorNative={item => item?._id}
        renderListItemInNative={renderListItem}
      />
    );
  };

  const renderTopHeader = () => {
    if (isAuthenticated) {
      return (
        <>
          <Container
            style={[tailwind('flex-row items-center justify-between rounded-2xl ')]}
            className="mb-4 flex w-full flex-1 flex-col gap-2">
            <Container
              style={tailwind('mb-4 flex w-full flex-row justify-between gap-y-4')}
              className="flex items-center justify-between">
              <Text
                style={[
                  tailwind(
                    `text-4 text-center capitalize not-italic leading-10 text-white ${!isLargeScreen ? 'text-8' : ''}`,
                  ),
                ]}>
                List of workouts
              </Text>
              <ActionButton
                label={'Add Workout'}
                onPress={() => {}}
                style={tailwind('rounded-xl')}
                left={<AntDesign name="pluscircleo" size={20} color="white" />}
              />
              {/* {renderVersionTab()} */}
            </Container>
          </Container>
          <Container
            style={[tailwind('mb-4 border-[0.5px] border-white')]}
            className="border border-white"
          />
        </>
      );
    }
    return null;
  };

  const renderVersionTab = () => {
    return (
      <View
        style={tailwind(
          `my-4 flex-row items-center justify-between rounded-2xl bg-WORKOUT_VERSION_BACKGROUND ${!isLargeScreen ? 'w-72 self-end' : ''} `,
        )}>
        <Pressable style={tailwind('flex-1')} onPress={() => setSelectedVersion('full')}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: selectedVersion === 'full' ? '#9C79C9' : 'transparent',
              borderColor: '#00000008',
              borderRadius: 16,
              borderWidth: 1,
              paddingVertical: 16,
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
    <Container style={tailwind(`h-full w-full flex-1 p-4 ${!isLargeScreen ? 'px-28' : ''} `)}>
      {renderVersionTab()}
      {renderWorkingListing()}
    </Container>
  );
}
