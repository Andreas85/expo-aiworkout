import Container from '@/components/atoms/Container';
import NoDataSvg from '@/components/svgs/NoDataSvg';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { getWorkouts } from '@/utils/workoutStorageOperationHelper';
import { useFocusEffect } from 'expo-router';
import React from 'react';
import { useCallback, useState } from 'react';
import { DeviceEventEmitter, ScrollView } from 'react-native';
import WorkoutList from './WorkoutList';
import { Workout } from '@/services/interfaces';
import { STORAGE_EMITTER_KEYS } from '@/utils/appConstants';

export default function MyWorkoutNotLoggedInList(props: {
  isEnabled: boolean;
  handleCardClick: (item: Workout) => void;
}) {
  const { isEnabled, handleCardClick } = props;
  const { isSmallScreen } = useWebBreakPoints();
  const [myWorkoutListing, setMyWorkoutListing] = useState<Workout[]>([]);

  const fetchInitials = async () => {
    const result: any = await getWorkouts();
    console.log('result', result);
    setMyWorkoutListing(result);
  };

  useFocusEffect(
    useCallback(() => {
      fetchInitials();

      // Add an event listener for workout changes
      const subscription = DeviceEventEmitter.addListener(
        STORAGE_EMITTER_KEYS.REFRESH_WORKOUT_LIST,
        () => {
          console.log('Workout data updated, refreshing...');
          fetchInitials();
        },
      );

      // Cleanup function to remove listener when screen is unfocused
      return () => {
        subscription.remove();
      };
    }, []),
  );

  const renderWorkingListing = () => {
    if (myWorkoutListing.length === 0) {
      return (
        <ScrollView
          contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Container>
            <NoDataSvg label="No workout found " />
          </Container>
        </ScrollView>
      );
    }

    // Calculate how many placeholders are needed to make length a multiple of 4
    const placeholdersNeeded =
      myWorkoutListing.length % 4 === 0 ? 0 : 4 - (myWorkoutListing.length % 4);

    // Add placeholders to fill the grid evenly
    const adjustedData = [
      ...myWorkoutListing,
      ...Array(placeholdersNeeded).fill({ isPlaceholder: true }),
    ];
    return (
      <>
        <WorkoutList
          data={adjustedData}
          isMyWorkout={true}
          keyName="my-workout-not-logged-in"
          numColumns={isSmallScreen ? 2 : 4}
          isEnabled={isEnabled}
          onItemPress={handleCardClick}
        />
      </>
    );
  };

  return <>{renderWorkingListing()}</>;
}
