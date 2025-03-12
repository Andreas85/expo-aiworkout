/* eslint-disable react/jsx-no-undef */
import Container from '@/components/atoms/Container';
import Loading from '@/components/atoms/Loading';
import { Text } from '@/components/Themed';
import useBreakPoints from '@/hooks/useBreakPoints';
import { useFetchData } from '@/hooks/useFetchData';
import { fetchMyWorkoutService, getWorkoutDetailById } from '@/services/workouts';
import { tailwind } from '@/utils/tailwind';
import { useCallback, useEffect, useState } from 'react';
import { ActionButton } from '../atoms/ActionButton';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';

import CustomSwitch from '../atoms/CustomSwitch';
import AddAndEditWorkoutModal from '../modals/AddAndEditWorkoutModal';
import useModal from '@/hooks/useModal';
import { REACT_QUERY_API_KEYS, REACT_QUERY_STALE_TIME } from '@/utils/appConstants';
import { router } from 'expo-router';
import { LayoutAnimation, Platform } from 'react-native';
import WorkoutList from '../molecules/WorkoutList';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import NoDataFallbackContainer from '../atoms/NoDataFallbackContainer';
import { useAuthStore } from '@/store/authStore';
import MyWorkoutNotLoggedInList from '../molecules/MyWorkoutNotLoggedInList';
import { Workout } from '@/services/interfaces';
import StarsIcon from '../atoms/AiStarsIcon';
import GenerateWorkoutAiBot from '../modals/GenerateWorkoutAiBot';

export default function MyWorkout() {
  const { isSmallScreen, isLargeScreen, isMediumScreen } = useBreakPoints();
  const { hideModal, showModal, openModal } = useModal();
  const {
    hideModal: hideGenerateModal,
    showModal: showGenerateModal,
    openModal: openGenerateModal,
  } = useModal();
  const queryClient = useQueryClient();
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  // Using LayoutAnimation for smooth transitions
  const toggleSwitch = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsEnabled(prevState => !prevState);
  }, []);

  const getFetchFunction = async () => {
    return await fetchMyWorkoutService();
  };

  const { data, error, isPending, refetch, isLoading, isSuccess } = useFetchData({
    queryFn: getFetchFunction,
    queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT],
    staleTime: REACT_QUERY_STALE_TIME.MY_WORKOUT,
    enabled: isAuthenticated,
  });

  const prefetchWorkouts = (id: string) => {
    // The results of this query will be cached like a normal query
    queryClient.prefetchQuery({
      queryFn: () => getWorkoutDetailById({ id: id }),
      queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, id],
      staleTime: REACT_QUERY_STALE_TIME.MY_WORKOUT_DETAILS,
      // gcTime: 1000,
    });
  };

  const handleAddWorkout = () => {
    showModal();
  };

  useEffect(() => {
    if (data && isSuccess) {
      data?.data?.map((item: any) => {
        prefetchWorkouts(item?._id);
      });
    }
  }, [data, isSuccess]);

  const handleCardClick = (item: Workout) => {
    // setWorkoutDetail(item);
    router.push(`/workout/${item?._id}`);
  };

  const handleGenerateWorkout = () => {
    // console.log('Generate Workout');
    showGenerateModal();
  };

  const renderWorkingListing = () => {
    if (isLoading) {
      return <Loading />;
    }
    if (error) return <Text>An error has occurred: + {error.message}</Text>;
    // Ensure bracketPrediction is iterable
    const iterableProductData = Array.isArray(data?.data) ? data?.data : [];

    if (iterableProductData.length === 0) {
      return <NoDataFallbackContainer />;
    }
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
            style={Platform.select({
              web: tailwind(
                `mb-4  ${isMediumScreen ? 'flex-1 flex-col items-start justify-start' : 'flex w-full flex-row justify-between'}  gap-y-4`,
              ),
              native: tailwind('mb-4 flex w-full flex-col items-start justify-start gap-y-4'),
            })}
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
            <Container
              style={Platform.select({
                web: tailwind('flex flex-row flex-wrap justify-end gap-4'),
                native: tailwind('flex flex-row justify-end gap-4'),
              })}>
              <ActionButton
                label={'Generate Workout'}
                onPress={handleGenerateWorkout}
                style={[
                  Platform.select({
                    web: tailwind('rounded-xl px-2'),
                    native: tailwind('rounded-xl px-2'),
                  }),
                ]}
                labelStyle={tailwind(isMediumScreen ? 'text-3.5' : '')}
                left={
                  <StarsIcon height={isMediumScreen ? 18 : 20} width={isMediumScreen ? 18 : 20} />
                }
              />
              <ActionButton
                label={'Add Workout'}
                onPress={handleAddWorkout}
                style={[
                  Platform.select({
                    web: tailwind(`rounded-xl ${isMediumScreen ? 'px-2' : ''}`),
                    native: tailwind('rounded-xl px-3.5'),
                  }),
                ]}
                labelStyle={tailwind(isMediumScreen ? 'text-3.5' : '')}
                left={
                  <AntDesign name="pluscircleo" size={isMediumScreen ? 18 : 20} color="white" />
                }
              />
            </Container>
          </Container>

          {/* <Container style={tailwind('mb-4 flex w-full flex-row justify-between gap-y-4')}>
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
          </Container> */}
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
        {isAuthenticated ? (
          renderWorkingListing()
        ) : (
          <MyWorkoutNotLoggedInList isEnabled={isEnabled} handleCardClick={handleCardClick} />
        )}
      </Container>
      {openModal && (
        <AddAndEditWorkoutModal
          isModalVisible={openModal}
          closeModal={hideModal}
          refetch={refetch}
        />
      )}

      <GenerateWorkoutAiBot isVisible={openGenerateModal} toggleModal={hideGenerateModal} />
    </>
  );
}
