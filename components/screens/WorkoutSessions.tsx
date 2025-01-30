import Container from '@/components/atoms/Container';
import { Text } from '@/components/Themed';
import { tailwind } from '@/utils/tailwind';
import { useCallback, useState } from 'react';
import CustomSwitch from '../atoms/CustomSwitch';
import { LayoutAnimation, Platform } from 'react-native';
import useBreakPoints from '@/hooks/useBreakPoints';
import React from 'react';
import WorkoutSessionList from '../molecules/WorkoutSessionList';
import { WorkoutSession } from '@/utils/workoutSessionHelper';
import { router } from 'expo-router';

export default function WorkoutSessions(props: { workoutSessionData: any }) {
  const { workoutSessionData } = props;
  const { isSmallScreen, isLargeScreen } = useBreakPoints();
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  // const toggleSwitch = () => setIsEnabled(prev => !prev);
  const toggleSwitch = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsEnabled(prevState => !prevState);
  }, []);

  const handleCardClick = (item: WorkoutSession) => {
    router.push(`/workout-session/${item?._id}/detail` as any);
  };

  const renderWorkingListing = () => {
    // if (isLoading && Platform.OS !== 'web') {
    //   return <Loading />;
    // }

    // if (error) return <Text>An error has occurred: + {error.message}</Text>;
    // Ensure bracketPrediction is iterable

    const iterableProductData = Array.isArray(workoutSessionData) ? workoutSessionData : [];

    // Calculate how many placeholders are needed to make length a multiple of 4
    const placeholdersNeeded =
      iterableProductData.length % 4 === 0 ? 0 : 4 - (iterableProductData.length % 4);

    // Add placeholders to fill the grid evenly
    const adjustedData = [
      ...iterableProductData,
      ...Array(placeholdersNeeded).fill({ isPlaceholder: true }),
    ];

    return (
      <WorkoutSessionList
        data={adjustedData}
        // onRefresh={refetch}
        // isPending={isPending}
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
              List of workouts sessions
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
