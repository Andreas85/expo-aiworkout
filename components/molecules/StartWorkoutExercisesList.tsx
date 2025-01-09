import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Platform } from 'react-native';

import { tailwind } from '@/utils/tailwind';
import StartWorkoutExerciseCardWrapper from './StartWorkoutExerciseCardWrapper';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { STRING_DATA, WORKOUT_STATUS } from '@/utils/appConstants';
import {
  expandRestAsExercisesInExistingExercises,
  findFirstIncompleteExercise,
  getTotalDurationTaken,
} from '@/utils/helper';
import { ExerciseElement } from '@/services/interfaces';
import { Audio } from 'expo-av';
import BaseTimer from '../modals/BaseTimer';
import usePlatform from '@/hooks/usePlatform';
import WorkoutComplete from '../modals/WorkoutComplete';
import useModal from '@/hooks/useModal';
import { router, useLocalSearchParams } from 'expo-router';
import {
  getWorkoutSessionById,
  updateExerciseInSession,
  updateWorkoutSessionStatus,
} from '@/utils/workoutSessionHelper';

const StartWorkoutExercisesList = (props: any) => {
  const { data, onRefresh = () => {}, refreshing } = props;
  const { sessionId } = useLocalSearchParams() as { slug: string; sessionId?: string };
  const { updateTotalWorkoutTime } = useWorkoutDetailStore();
  const [exerciseData, setExerciseData] = useState<ExerciseElement[]>([]);
  const flatListRef = useRef<FlatList>(null); // Add ref for the FlatList
  const [selectedIndex, setSelectedIndex] = useState<number>(0); // State to track selected index
  const [sound, setSound] = useState<Audio.Sound | null>(null); // State for sound
  const [showModal, setShowModel] = useState(false);
  const {
    openModal: openWorkoutComplete,
    showModal: showModelWorkoutComplete,
    hideModal: hideModalWorkoutComplete,
  } = useModal();
  const { isWeb } = usePlatform();
  // open modal
  const openModal = () => {
    setShowModel(true);
  };

  // close modal
  const hideModal = () => {
    setShowModel(false);
  };

  const processDataBasedOnSession = async (workoutExercises: ExerciseElement[]) => {
    const workoutSessionOfExercises = await getWorkoutSessionById(sessionId ?? '');

    if (workoutSessionOfExercises) {
      const unfinishedExerciseData = findFirstIncompleteExercise(
        workoutSessionOfExercises?.exercises,
      );
      const totalElapsedTime = getTotalDurationTaken(workoutSessionOfExercises?.exercises);
      console.log('totalElapsedTime', totalElapsedTime);
      updateTotalWorkoutTime(totalElapsedTime);
      if (unfinishedExerciseData) {
        const reqIndex = workoutExercises.findIndex(
          (item: any) => item?._id === unfinishedExerciseData?.exerciseId,
        );

        setSelectedIndex(reqIndex);
      }
    }
  };

  useEffect(() => {
    if (data && data.length > 0) {
      const updateData = expandRestAsExercisesInExistingExercises(data) as ExerciseElement[];
      setExerciseData(updateData);
      processDataBasedOnSession(updateData);
    }
    return () => {
      if (sound) {
        sound.unloadAsync(); // Cleanup sound resource
      }
    };
  }, [data]);

  // Play a sound
  const playSound = useCallback(async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/buzzer-countdown.mp3'), // Replace with your sound file
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, []);

  // Stop and unload the sound
  const stopSound = useCallback(async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null); // Clear sound after unloading
      } catch (error) {
        console.error('Error stopping sound:', error);
      }
    }
  }, [sound]);

  const { updateWorkoutTimer, updateWorkoutCompleted } = useWorkoutDetailStore();

  const onIncrement = () => {
    console.log('Increment');
  };

  const onDecrement = () => {
    console.log('Decrement');
  };

  const getCurrentExerciseData = () => {
    return exerciseData[selectedIndex];
  };

  const getNextExerciseData = () => {
    return exerciseData[selectedIndex + 1];
  };

  const handleModalClose = () => {
    // hideModal();

    // Schedule state updates to avoid conflicts
    setTimeout(() => {
      updateWorkoutTimer(true);
      hideModal();
      startNextExercise(); // Proceed to the next exercise
      // scrollToItem();
    }, 500);
  };

  const updateWorkoutStatus = async () => {
    const result = await updateWorkoutSessionStatus(sessionId ?? '', 'COMPLETED');
    console.log('Workout status updated');
  };

  const workoutCycleCompleted = () => {
    console.log('Workout cycle completed');
    updateWorkoutStatus();
    // update workout status

    updateWorkoutTimer(false);
    updateWorkoutCompleted(true);
    showModelWorkoutComplete();
  };

  const handleModalWorkoutClick = () => {
    console.log('Workout completed clicked');
    router.back();
  };

  const saveWorkoutSessionExerciseRecord = async () => {
    const currentExercise = getCurrentExerciseData();
    if (!currentExercise) return;
    const payload = {
      sessionId: sessionId ?? '',
      exerciseId: currentExercise._id ?? '',
      durationTaken: currentExercise.duration,
      repsTaken: currentExercise.reps,
    };

    await updateExerciseInSession(
      payload.sessionId,
      payload.exerciseId,
      payload.durationTaken,
      payload.repsTaken,
    );
  };

  const startNextExercise = () => {
    console.log('Start Next Exercise');

    const nextIndex = selectedIndex + 1;
    console.log('Scrolling to index:', nextIndex);
    if (nextIndex > exerciseData.length) return;
    setSelectedIndex(nextIndex);

    if (flatListRef.current && nextIndex <= exerciseData.length - 1) {
      flatListRef.current.scrollToIndex({
        index: nextIndex,
        animated: true,
        viewPosition: nextIndex === 0 || nextIndex === exerciseData.length - 1 ? 0 : 0.5, // Keep center for non-edge indices
      });
    }
  };

  // Scroll to a specific item by index
  const scrollToItem = () => {
    const hasReps = getCurrentExerciseData()?.reps;
    const isRest = getNextExerciseData()?.type === STRING_DATA.REST;

    const isLastExerciseCard = selectedIndex + 1 >= exerciseData?.length;

    // Save the current exercise record
    saveWorkoutSessionExerciseRecord();

    if (isLastExerciseCard) {
      startNextExercise();
      console.log('Workout finished 1', isLastExerciseCard);
      workoutCycleCompleted();
      if (!hasReps) {
        console.log('Workout finished');
        updateWorkoutTimer(false);
        updateWorkoutCompleted(true);
      }
      return;
    }
    // startNextExercise();
    console.log(hasReps, isRest, 'isRest');

    if (!hasReps && isRest) {
      startNextExercise();
      updateWorkoutTimer(true);
    } else if (!hasReps) {
      // preStartNextExercise.value = true;
      updateWorkoutTimer(false);
      openModal();
    } else {
      if (!isRest) {
        playSound();
        setTimeout(() => {
          stopSound();
          updateWorkoutTimer(true);
          startNextExercise();
        }, 500);
      } else {
        updateWorkoutTimer(true);
        startNextExercise();
      }
    }
  };

  // Memoize the renderItem to avoid re-renders
  const renderListItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      return (
        <StartWorkoutExerciseCardWrapper
          key={item?._id}
          exercise={item}
          isLast={exerciseData?.length ? index === exerciseData?.length - 1 : false}
          isFirst={index === 0}
          isCompleted={index < selectedIndex}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          isSelectedWorkout={selectedIndex === index}
          handleNextExercise={scrollToItem}
          handleNextRestExercise={scrollToItem}
          isRestCard={item?.type === STRING_DATA.REST}
        />
      );
    },
    [selectedIndex, exerciseData],
  );

  // Layout optimization for FlatList
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 200,
      offset: 200 * index,
      index,
    }),
    [],
  );

  const renderButtonInWeb = () => {
    if (isWeb) {
      return (
        <button
          id="hiddenButton"
          // style={{ display: 'none' }}
          onClick={() => {
            console.log('Hidden button clicked');
            // Play an initial silent sound or any short sound to meet interaction requirements
          }}
        />
      );
    }
  };

  return (
    <>
      {renderButtonInWeb()}
      <FlatList
        ref={flatListRef} // Attach the ref
        data={exerciseData}
        initialNumToRender={7}
        maxToRenderPerBatch={7}
        updateCellsBatchingPeriod={50}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item?._id?.toString() + 'is-full-version' + index.toString()}
        renderItem={renderListItem}
        // extraData={selectedIndex}
        contentContainerStyle={[
          Platform.select({
            web: tailwind(` `),
            native: tailwind(``),
          }),
        ]}
        style={
          Platform.select({
            web: tailwind(`overflow-y-scroll `),
            native: tailwind(` `),
          }) as any
        }
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
        getItemLayout={getItemLayout}
        // windowSize={10} // Adjust based on the number of items visible on screen
      />
      {/* Modal for next exercise */}
      <>
        <BaseTimer
          isVisible={showModal}
          toggleModal={() => handleModalClose()}
          currentExercise={exerciseData?.[selectedIndex + 1]}
          onComplete={() => handleModalClose()}
        />

        <WorkoutComplete
          isVisible={openWorkoutComplete}
          toggleModal={hideModalWorkoutComplete}
          handleClick={handleModalWorkoutClick}
        />
      </>
    </>
  );
};

export default memo(StartWorkoutExercisesList);
