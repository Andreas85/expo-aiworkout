import Container from '@/components/atoms/Container';
import Loading from '@/components/atoms/Loading';
import { Text } from '@/components/Themed';
import { useFetchData } from '@/hooks/useFetchData';
import { fetchPublicWorkoutService, fetchPublicWorkoutServiceById } from '@/services/workouts';
import { tailwind } from '@/utils/tailwind';
import { useCallback, useEffect, useState } from 'react';
import CustomSwitch from '../atoms/CustomSwitch';
import { REACT_QUERY_API_KEYS, REACT_QUERY_STALE_TIME } from '@/utils/appConstants';
import { useAuthStore } from '@/store/authStore';
import { LayoutAnimation, Platform } from 'react-native';
import { router } from 'expo-router';
import { debounce } from 'lodash';
import WorkoutList from '../molecules/WorkoutList';
import useBreakPoints from '@/hooks/useBreakPoints';
import { useQueryClient } from '@tanstack/react-query';

export default function PublicWorkout() {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const { isSmallScreen, isLargeScreen } = useBreakPoints();
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [productData, setProductData] = useState<any[]>([]);
  // const toggleSwitch = () => setIsEnabled(prev => !prev);

  const toggleSwitch = useCallback(
    debounce(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsEnabled(prevState => !prevState);
    }, 500), // 500ms delay
    [],
  );

  const getFetchFunction = async () => {
    // return await fetchPublicWorkoutService();
    return await fetchPublicWorkoutService();
  };

  // Don't refetch on window focus and hit api after 1 minutes
  const { data, isPending, refetch, isLoading, fetchStatus } = useFetchData({
    queryFn: getFetchFunction,
    queryKey: [REACT_QUERY_API_KEYS.PUBLIC_WORKOUT],
    staleTime: REACT_QUERY_STALE_TIME.PUBLIC_WORKOUT,
    // enabled: false,
  });

  const prefetchWorkouts = (id: string) => {
    // The results of this query will be cached like a normal query
    queryClient.prefetchQuery({
      queryFn: () => fetchPublicWorkoutServiceById({ id: id }),
      queryKey: [REACT_QUERY_API_KEYS.PUBLIC_WORKOUT_DETAILS, id],
      staleTime: REACT_QUERY_STALE_TIME.PUBLIC_WORKOUT_DETAILS,
    });
  };

  useEffect(() => {
    if (data && fetchStatus === 'idle') {
      setProductData(data?.data);
      data?.data?.map((item: any) => {
        prefetchWorkouts(item?._id);
      });
    }
  }, [data, fetchStatus]);

  const handleCardClick = (item: any) => {
    // prefetchWorkouts(item?._id);
    router.push(`/workout/public/${item?._id}`);
  };

  const renderWorkingListing = () => {
    if (isLoading && Platform.OS !== 'web') {
      return <Loading />;
    }

    // if (error) return <Text>An error has occurred: + {error.message}</Text>;
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
      <WorkoutList
        data={adjustedData}
        onRefresh={refetch}
        isPending={isPending}
        numColumns={isSmallScreen ? 2 : 4}
        isEnabled={isEnabled}
        onItemPress={handleCardClick}
        keyName="public-workout"
      />
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
                  web: tailwind(`${isLargeScreen ? 'text-[1.125rem]' : 'text-[2rem]'}`),
                  native: tailwind('text-[1.125rem]'),
                }),
                tailwind(` text-center capitalize not-italic leading-10 text-white `),
              ]}>
              {isAuthenticated ? 'List of workouts' : 'Public workouts'}
            </Text>
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
    return <CustomSwitch isEnabled={isEnabled} toggleSwitch={toggleSwitch} label="Short Version" />;
  };

  return (
    <>
      <Container
        style={tailwind(`h-full w-full flex-1 px-4 ${!isLargeScreen ? 'my-4 px-28' : ''} `)}>
        {renderVersionTab()}
        {renderTopHeader()}
        {renderWorkingListing()}
      </Container>
    </>
  );
}
