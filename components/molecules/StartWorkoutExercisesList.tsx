import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Platform } from 'react-native';

import { tailwind } from '@/utils/tailwind';
import StartWorkoutExerciseCardWrapper from './StartWorkoutExerciseCardWrapper';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { STRING_DATA } from '@/utils/appConstants';
import {
  expandRestAsExercisesInExistingExercises,
  findFirstIncompleteExercise,
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
import { interactionStore } from '@/store/interactionStore';

const StartWorkoutExercisesList = (props: any) => {
  const hasRunInitially = useRef(false);
  const { slug } = useLocalSearchParams() as { slug: string; sessionId?: string };

  const workoutDetail = useWorkoutDetailStore(state => state.workoutDetail);
  const muted = interactionStore(state => state.muted);
  const {
    updateRemainingTime,
    updateWorkoutTimer,
    updateWorkoutCompleted,
    updateIsActiveRepExerciseCard,
  } = useWorkoutDetailStore();
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

  const disableWorkoutTimer = (hasReps: number) => {
    if (hasReps) {
      updateIsActiveRepExerciseCard?.(true);
    } else {
      updateIsActiveRepExerciseCard?.(false);
    }
  };
  // open modal
  const openModal = () => {
    setShowModel(true);
  };

  // close modal
  const hideModal = () => {
    setShowModel(false);
  };

  const processDataBasedOnSession = async (workoutExercises: ExerciseElement[]) => {
    const workoutSessionOfExercises = await getWorkoutSessionById(slug ?? '');
    const isCompleted = workoutSessionOfExercises?.status === 'completed';

    if (workoutSessionOfExercises) {
      const unfinishedExerciseData = findFirstIncompleteExercise(
        workoutSessionOfExercises?.exercises,
      );
      const remainingTime = workoutSessionOfExercises?.remainingTime ?? 0;
      // console.log('unfinishedExerciseDataunfinishedExerciseData', {
      //   remainingTime,
      //   unfinishedExerciseData,
      // });
      updateRemainingTime(remainingTime);
      if (isCompleted) {
        setSelectedIndex(workoutExercises?.length);
        return;
      }
      if (unfinishedExerciseData) {
        const reqIndex = workoutExercises.findIndex(
          (item: any) => item?._id === unfinishedExerciseData?.exerciseId,
        );
        console.log('hasRunInitially.current1', hasRunInitially.current);
        if (hasRunInitially.current) return;
        hasRunInitially.current = true;
        setSelectedIndex(reqIndex);
        const hasReps = workoutExercises[reqIndex]?.reps;
        disableWorkoutTimer(hasReps);
        setTimeout(() => {
          try {
            if (flatListRef.current && reqIndex < workoutExercises.length) {
              flatListRef.current.scrollToIndex({
                index: reqIndex,
                animated: true,
                viewPosition: 0.5,
              });
              console.log('hasRunInitially.current2', hasRunInitially.current);
            }
          } catch (error) {
            console.warn('Error scrolling to index:', error);
          }
        }, 100);
      }
    }
  };

  useEffect(() => {
    if (workoutDetail && workoutDetail?.exercises.length > 0) {
      const workoutExercises = workoutDetail?.exercises;
      const updateData = expandRestAsExercisesInExistingExercises(
        workoutExercises,
      ) as ExerciseElement[];
      // console.log('workoutExercisesworkoutExercises', workoutDetail?.exercises);
      setExerciseData(updateData);
      processDataBasedOnSession(updateData);
      // setExerciseData(workoutExercises);
    }
    return () => {
      if (sound) {
        sound.unloadAsync(); // Cleanup sound resource
      }
    };
  }, [workoutDetail]);

  useEffect(() => {
    hasRunInitially.current = false;
  }, []);

  // Play a sound
  const playSound = useCallback(async () => {
    if (muted) return;
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/buzzer-countdown.mp3'), // Replace with your sound file
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [muted]);

  // Stop and unload the sound
  const stopSound = useCallback(async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        try {
          await sound.stopAsync();
          await sound.unloadAsync();
          setSound(null); // Clear sound after unloading
        } catch (error) {
          console.error('Error stopping sound:', error);
        }
      } else {
        console.warn('Sound is not loaded, cannot stop it.');
      }
    }
  }, [sound]);

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
    const nexthasReps = getNextExerciseData()?.reps;
    // hideModal();

    // Schedule state updates to avoid conflicts
    setTimeout(() => {
      updateWorkoutTimer(true);
      disableWorkoutTimer(nexthasReps);
      hideModal();
      startNextExercise(); // Proceed to the next exercise
      // scrollToItem();
    }, 500);
  };

  const workoutCycleCompleted = () => {
    console.log('Workout cycle completed');

    updateWorkoutTimer(false);
    updateWorkoutCompleted(true);
    showModelWorkoutComplete();
  };

  const handleModalWorkoutClick = () => {
    console.log('Workout completed clicked');
    router.back();
  };

  const saveWorkoutSessionExerciseRecord = async (props: {
    durationTaken: number;
    currentExerciseCompleted: boolean;
  }) => {
    const { durationTaken, currentExerciseCompleted } = props;
    const currentExercise = getCurrentExerciseData();

    console.log('Current Exercise:', { durationTaken, currentExerciseCompleted });
    // if (!currentExercise) return;
    const payload = {
      sessionId: slug ?? '',
      exerciseId: currentExercise?._id ?? '',
      durationTaken: durationTaken,
      repsTaken: currentExercise?.reps,
    };

    await updateExerciseInSession(
      payload.sessionId,
      payload.exerciseId,
      payload.durationTaken,
      payload.repsTaken,
    );

    const isLastExerciseCard = selectedIndex + 1 >= exerciseData?.length;
    if (isLastExerciseCard) {
      await updateWorkoutSessionStatus(slug, 'completed');
    }
  };

  const startNextExercise = () => {
    console.log('Start Next Exercise');

    const nextIndex = selectedIndex + 1;
    console.log('Scrolling to index:', { nextIndex, exerciseData });
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
  const scrollToItem = (props: { durationTaken: number; currentExerciseCompleted: boolean }) => {
    const { durationTaken, currentExerciseCompleted } = props;
    const hasReps = getCurrentExerciseData()?.reps;
    const isCurrentRest = getCurrentExerciseData()?.type === STRING_DATA.REST;

    const isLastExerciseCard = selectedIndex + 1 >= exerciseData?.length;
    // console.log('exerciseDataexerciseData', { exerciseData });
    // Save the current exercise record
    saveWorkoutSessionExerciseRecord({
      durationTaken,
      currentExerciseCompleted,
    });

    if (isLastExerciseCard && exerciseData?.length > 0) {
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
    if (hasReps) return;

    if (isCurrentRest) {
      console.log('Rest card, starting next exercise');
      updateWorkoutTimer(false);
      openModal();
      return;
    }

    playSound();
    setTimeout(() => {
      stopSound();
      updateWorkoutTimer(true);
      startNextExercise();
    }, 300);
  };

  const handleNextRepsExercise = (props: {
    durationTaken: number;
    currentExerciseCompleted: boolean;
  }) => {
    const { durationTaken, currentExerciseCompleted } = props;
    console.log('Reps workout finished- Exercise-list', { props });
    saveWorkoutSessionExerciseRecord({
      durationTaken,
      currentExerciseCompleted,
    });

    const isLastExerciseCard = selectedIndex + 1 >= exerciseData?.length;
    if (isLastExerciseCard && exerciseData?.length > 0) {
      console.log('(handleNextRepsExercise) Workout finished 1', isLastExerciseCard);
      startNextExercise();
      workoutCycleCompleted();
      updateWorkoutTimer(false);
      updateWorkoutCompleted(true);

      return;
    }

    updateWorkoutTimer(false);
    openModal();
    // startNextExercise();
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
          index={index}
          isCompleted={index < selectedIndex}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          isSelectedWorkout={selectedIndex === index}
          handleNextExercise={scrollToItem}
          handleNextRestExercise={scrollToItem}
          handleNextRepsExercise={handleNextRepsExercise}
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
