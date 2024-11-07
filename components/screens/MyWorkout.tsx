/* eslint-disable react/jsx-no-undef */
import Container from '@/components/atoms/Container';
import Loading from '@/components/atoms/Loading';
import { Text } from '@/components/Themed';
import useBreakPoints from '@/hooks/useBreakPoints';
import { useFetchData } from '@/hooks/useFetchData';
import { fetchMyWorkoutService } from '@/services/workouts';
import { tailwind } from '@/utils/tailwind';
import { useCallback, useEffect, useState } from 'react';
import { ActionButton } from '../atoms/ActionButton';
import { AntDesign } from '@expo/vector-icons';

import CustomSwitch from '../atoms/CustomSwitch';
import AddAndEditWorkoutModal from '../modals/AddAndEditWorkoutModal';
import useModal from '@/hooks/useModal';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';
import { router } from 'expo-router';
import { LayoutAnimation, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { debounce } from 'lodash';
import WorkoutList from '../molecules/WorkoutList';
import { keepPreviousData } from '@tanstack/react-query';

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

  const { data, error, isPending, refetch, isLoading } = useFetchData({
    queryFn: getFetchFunction,
    queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT],

    keepPreviousData: keepPreviousData,
  });

  const handleAddWorkout = () => {
    showModal();
  };

  const handleCardClick = (item: any) => {
    router.push(`/workout/${item?._id}`);
  };

  const renderWorkingListing = () => {
    if (isLoading) {
      return <Loading />;
    }
    if (error) return <Text>An error has occurred: + {error.message}</Text>;
    // Ensure bracketPrediction is iterable
    const iterableProductData = Array.isArray(data?.data) ? data?.data : [];

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
