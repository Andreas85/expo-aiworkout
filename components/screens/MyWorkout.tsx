/* eslint-disable react/jsx-no-undef */
import Container from '@/components/atoms/Container';
import ImageContainer from '@/components/atoms/ImageContainer';
import Loading from '@/components/atoms/Loading';
import TextContainer from '@/components/atoms/TextContainer';
import { Text } from '@/components/Themed';
import useBreakPoints from '@/hooks/useBreakPoints';
import { useFetchData } from '@/hooks/useFetchData';
import { fetchMyWorkoutService } from '@/services/workouts';
// import { useAuthStore } from '@/store/authStore';
import { tailwind } from '@/utils/tailwind';
import { useCallback, useEffect, useState } from 'react';
import { ActionButton } from '../atoms/ActionButton';
import { AntDesign } from '@expo/vector-icons';
import { IMAGES } from '@/utils/images';
import CustomSwitch from '../atoms/CustomSwitch';
import AddAndEditWorkoutModal from '../modals/AddAndEditWorkoutModal';
import useModal from '@/hooks/useModal';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';
import { router } from 'expo-router';
import { LayoutAnimation, Platform, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { debounce } from 'lodash';
import WorkoutList from '../molecules/WorkoutList';

export default function MyWorkout() {
  // const { isAuthenticated } = useAuthStore();
  const navigation = useNavigation();
  const [productData, setProductData] = useState<any[]>([]);
  const { isSmallScreen, isLargeScreen } = useBreakPoints();
  const { hideModal, showModal, openModal } = useModal();
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  // const toggleSwitch = () => setIsEnabled(!isEnabled);

  // Using LayoutAnimation for smooth transitions
  const toggleSwitch = useCallback(
    debounce(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsEnabled(prevState => !prevState);
    }, 500), // 500ms delay
    [],
  );

  const getFetchFunction = async () => {
    return await fetchMyWorkoutService();
  };

  const { data, error, isPending, refetch, fetchStatus } = useFetchData({
    queryFn: getFetchFunction,
    queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT],
  });

  useEffect(() => {
    if (data) {
      setProductData(data?.data);
    }
  }, [data]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // do something
      console.log('Api is called');
      refetch();
    });

    return unsubscribe;
  }, [navigation]);

  const handleAddWorkout = () => {
    showModal();
  };

  const handleCardClick = (item: any) => {
    router.push(`/workout/${item?._id}`);
  };

  const renderListItem = (item: any, index: number, isEnabled: boolean) => {
    if (item?.isPlaceholder) {
      return <Container style={tailwind(`relative h-full w-full flex-1`)}></Container>;
    }
    return (
      <Pressable style={tailwind('flex-1')} onPress={() => handleCardClick(item)}>
        <Container
          style={[
            Platform.select({ web: tailwind('cursor-pointer') }),
            tailwind(
              `relative h-full w-full flex-1 grow self-center ${isEnabled ? 'rounded-lg bg-NAVBAR_BACKGROUND' : ''}`,
            ),
          ]}>
          {!isEnabled && (
            <ImageContainer
              source={IMAGES.fitness}
              styleNative={[tailwind(`aspect-square  w-full  self-center rounded-2xl `)]}
              contentFit="fill"
            />
          )}
          <TextContainer
            data={item?.name}
            style={tailwind(
              ` h-full w-full flex-1 grow text-center ${isEnabled ? 'my-4' : 'mt-4'}`,
            )}
          />
        </Container>
      </Pressable>
    );
  };

  const renderWorkingListing = () => {
    if (fetchStatus === 'fetching') {
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
      <>
        <WorkoutList
          data={adjustedData}
          onRefresh={refetch}
          isMyWorkout={true}
          isPending={isPending}
          keyName="my-workout"
          numColumns={isSmallScreen ? 2 : 4}
          isEnabled={isEnabled}
          onItemPress={handleCardClick}
        />
      </>
    );
  };

  const renderTopHeader = () => {
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
                Platform.select({
                  web: tailwind(
                    `text-5 text-center capitalize not-italic leading-10 text-white ${!isLargeScreen ? 'text-8' : ''}`,
                  ),
                  native: tailwind(
                    `text-4 text-center capitalize not-italic leading-10 text-white `,
                  ),
                }),
              ]}>
              List of workouts
            </Text>
            <ActionButton
              label={'Add Workout'}
              onPress={handleAddWorkout}
              style={[
                Platform.select({
                  web: tailwind('rounded-xl'),
                  native: tailwind('rounded-xl px-3.5'),
                }),
              ]}
              left={<AntDesign name="pluscircleo" size={20} color="white" />}
            />
          </Container>
        </Container>
        <Container
          style={[tailwind('mb-4 border-[0.5px] border-white')]}
          className="border border-white"
        />
      </>
    );
  };

  const renderVersionTab = () => {
    return (
      <>
        <CustomSwitch isEnabled={isEnabled} toggleSwitch={toggleSwitch} label="Short Version" />
      </>
    );
  };

  return (
    <>
      <Container
        style={tailwind(`h-full w-full flex-1 px-4 ${!isLargeScreen ? 'my-4 px-28' : ''} `)}>
        {renderVersionTab()}
        {renderTopHeader()}
        {renderWorkingListing()}
      </Container>
      {openModal && <AddAndEditWorkoutModal isModalVisible={openModal} closeModal={hideModal} />}
    </>
  );
}
