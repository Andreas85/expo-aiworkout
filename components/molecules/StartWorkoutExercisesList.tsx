import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Platform, View } from 'react-native';

import { tailwind } from '@/utils/tailwind';
import StartWorkoutExerciseCardWrapper from './StartWorkoutExerciseCardWrapper';
import { STRING_DATA, WORKOUT_STATUS } from '@/utils/appConstants';
import {
  expandRestAsExercisesInExistingExercises,
  findFirstIncompleteExercise,
} from '@/utils/helper';
import { ExerciseElement } from '@/services/interfaces';
import BaseTimer from '../modals/BaseTimer';
import usePlatform from '@/hooks/usePlatform';
import WorkoutComplete from '../modals/WorkoutComplete';
import useModal from '@/hooks/useModal';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import {
  scrollToIndex,
  smartScrollToIndex,
  updateWorkoutSessionStatus,
  WorkoutSession,
} from '@/utils/workoutSessionHelper';
import { interactionStore } from '@/store/interactionStore';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { useAuthStore } from '@/store/authStore';
import { updateWorkoutSessionFinishedStatus } from '@/services/workouts';
import useWorkoutSessionDetailsTracking from '@/hooks/useWorkoutSessionDetails';
import { useWorkoutSessionStore } from '@/store/workoutSessiondetail';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import boomSound from '@/assets/sounds/buzzer-countdown1.mp3';

const ITEM_HEIGHT = 100; // Replace with the actual height of your list items
const CONTAINER_HEIGHT = 500; // Replace with the actual height of the FlatList container

const StartWorkoutExercisesList = (props: any) => {
  const hasRunInitially = useRef(false);
  const { loadAudio, startAudio, stopAudio } = useAudioPlayer();
  const { slug } = useLocalSearchParams() as { slug: string; sessionId?: string };
  const { isLargeScreen } = useWebBreakPoints();
  const workoutSessionDetails = useWorkoutSessionStore(state => state.workoutSessionDetails);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const muted = interactionStore(state => state.muted);
  const itemHeights = useRef<{ [key: string]: number }>({});

  // Modify your onItemLayout to handle missing heights
  const onItemLayout = (event: any, index: number, itemId: string) => {
    const height = event.nativeEvent.layout.height;
    console.log('onItemLayout', { height, index, itemId });
    if (!itemHeights.current[itemId]) {
      itemHeights.current[itemId] = height;
      // Trigger re-render if height changed significantly
      if (Math.abs(height - ITEM_HEIGHT) > 10) {
        smartScrollToIndex(selectedIndex, exerciseData, flatListRef);
      }
    }
  };
  const {
    updateRemainingTime,
    updateWorkoutTimer,
    updateWorkoutCompleted,
    updateIsActiveRepExerciseCard,
  } = useWorkoutSessionStore();
  const { handleUpdateExerciseInWorkoutSession } = useWorkoutSessionDetailsTracking();
  const [exerciseData, setExerciseData] = useState<ExerciseElement[]>([]);
  const flatListRef = useRef<FlatList>(null); // Add ref for the FlatList
  const [selectedIndex, setSelectedIndex] = useState<number>(0); // State to track selected index
  const [showModal, setShowModel] = useState(false);
  const [containerHeight, setContainerHeight] = useState(CONTAINER_HEIGHT);

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

  const handleWorkoutStatusUpdate = async () => {
    if (isAuthenticated) {
      // Update the workout session status
      await updateWorkoutSessionFinishedStatus({
        id: slug,
        formData: {
          status: WORKOUT_STATUS.FINISHED,
        },
      });
      // console.log('(API call here ) INFO:: Workout completed api calling done');
      return;
    }
    await updateWorkoutSessionStatus(slug, 'FINISHED');
  };

  const processDataBasedOnSession = (
    workoutExercises: ExerciseElement[],
    workoutDetailData: WorkoutSession,
  ) => {
    // const workoutSessionOfExercises = await getWorkoutSessionById(slug ?? '');
    const workoutSessionOfExercises = workoutDetailData;
    // console.log('workoutSessionOfExercises', { workoutDetailData });
    const isCompleted = workoutSessionOfExercises?.status === 'FINISHED';

    if (workoutSessionOfExercises) {
      const unfinishedExerciseData = findFirstIncompleteExercise(
        workoutSessionOfExercises?.exercises,
      );
      if (!unfinishedExerciseData && !isCompleted) {
        // await updateWorkoutSessionStatus(slug, 'completed');
        handleWorkoutStatusUpdate();
        updateWorkoutTimer(false);
        updateWorkoutCompleted(true);
      }
      const remainingTime = workoutSessionOfExercises?.remainingTime ?? 0;
      // console.log('unfinishedExerciseDataunfinishedExerciseData', {
      //   remainingTime,
      //   unfinishedExerciseData,
      //   workoutSessionOfExercises,
      //   isCompleted,
      // });
      updateRemainingTime(remainingTime);
      if (isCompleted) {
        setSelectedIndex(workoutExercises?.length);
        return;
      }
      if (unfinishedExerciseData) {
        const reqIndex = workoutExercises.findIndex(
          (item: ExerciseElement) => item?.exerciseId === unfinishedExerciseData?.exerciseId,
        );
        // console.log('hasRunInitially.current1', {
        //   reqIndex,
        //   hasRunInitially: hasRunInitially.current,
        // });
        const hasReps = workoutExercises[reqIndex]?.reps;
        disableWorkoutTimer(hasReps);
        if (hasRunInitially.current) return;
        hasRunInitially.current = true;
        setSelectedIndex(reqIndex);
        setTimeout(() => {
          handleScrollBehaviorBasedOnPlatform(reqIndex);
        }, 100);
      }
    }
  };

  useEffect(() => {
    if (workoutSessionDetails && workoutSessionDetails?.exercises.length > 0) {
      const workoutExercises = workoutSessionDetails?.exercises;
      const updateData = expandRestAsExercisesInExistingExercises(
        workoutExercises,
      ) as ExerciseElement[];
      // console.log('workoutExercisesworkoutExercises', workoutDetail?.exercises);
      setExerciseData(updateData);
      processDataBasedOnSession(updateData, workoutSessionDetails);
      // setExerciseData(workoutExercises);
    }
  }, [workoutSessionDetails]);

  useFocusEffect(
    useCallback(() => {
      loadAudio(boomSound);
      hasRunInitially.current = false;
    }, []),
  );

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

  const boomSoundStartAndPause = (mutateFn: any) => {
    // console.log('boomSoundStartAndPause', { muted });
    startAudio(muted);
    setTimeout(() => {
      stopAudio();
      mutateFn?.();
    }, 300);
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
    const nextIndex = selectedIndex + 1;
    setSelectedIndex(nextIndex);
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
    isLastExerciseCard?: boolean;
  }) => {
    const { durationTaken, currentExerciseCompleted, isLastExerciseCard } = props;
    const currentExercise = getCurrentExerciseData();
    const isRestTypeExercise = currentExercise?.type === STRING_DATA.REST;
    // console.log('Current Exercise:', {
    //   durationTaken,
    //   currentExerciseCompleted,
    //   isLastExerciseCard,
    //   isRestTypeExercise,
    // });
    if (isRestTypeExercise) return;
    // const payload = {
    //   sessionId: slug ?? '',
    //   exerciseId: currentExercise?._id ?? '',
    //   durationTaken: durationTaken,
    //   repsTaken: currentExercise?.reps,
    // };

    // await updateExerciseInSession(
    //   payload.sessionId,
    //   payload.exerciseId,
    //   payload.durationTaken,
    //   payload.repsTaken,
    // );

    // if (isLastExerciseCard) {
    //   await updateWorkoutSessionStatus(slug, 'FINISHED');
    // }
    console.log('currentExercise (before handleUpdateExerciseInWorkoutSession)', {
      currentExercise,
    });
    handleUpdateExerciseInWorkoutSession({
      sessionId: slug ?? '',
      exerciseId: currentExercise?.exerciseId ?? '',
      workoutSessionExerciseId: currentExercise?._id ?? '',
      durationTaken: durationTaken,
      repsTaken: currentExercise?.reps ?? 0,
      isLastExerciseCard,
    });
  };

  const startNextExercise = () => {
    console.log('Start Next Exercise');

    const nextIndex = selectedIndex + 1;

    if (nextIndex >= exerciseData.length) return; // No further scrolling if at the end
    setSelectedIndex(nextIndex);
    handleScrollBehaviorBasedOnPlatform(nextIndex);
  };

  // Scroll to a specific item by index
  const scrollToItem = (props: { durationTaken: number; currentExerciseCompleted: boolean }) => {
    const { durationTaken, currentExerciseCompleted } = props;
    const hasReps = getCurrentExerciseData()?.reps;
    const isCurrentRest = getCurrentExerciseData()?.type === STRING_DATA.REST;
    const isNextExerciseRest = getNextExerciseData()?.type === STRING_DATA.REST;

    const isLastExerciseCard = selectedIndex + 1 >= exerciseData?.length;
    // console.log('exerciseDataexerciseData (scrollToItem)', { exerciseData });
    // Save the current exercise record
    saveWorkoutSessionExerciseRecord({
      durationTaken,
      currentExerciseCompleted,
      isLastExerciseCard,
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
    disableWorkoutTimer(hasReps);
    // if (hasReps) return;

    if (isCurrentRest) {
      console.log('Rest card, starting next exercise');
      updateWorkoutTimer(false);
      openModal();
      return;
    }

    console.log('playSound', { isNextExerciseRest, isCurrentRest, hasReps });

    boomSoundStartAndPause(() => {
      updateWorkoutTimer(true);
      startNextExercise();
    });
  };

  const handleNextRepsExercise = (props: {
    durationTaken: number;
    currentExerciseCompleted: boolean;
  }) => {
    const { durationTaken, currentExerciseCompleted } = props;
    console.log('Reps workout finished- Exercise-list', { props });
    const isLastExerciseCard = selectedIndex + 1 >= exerciseData?.length;
    saveWorkoutSessionExerciseRecord({
      durationTaken,
      currentExerciseCompleted,
      isLastExerciseCard,
    });

    if (isLastExerciseCard && exerciseData?.length > 0) {
      console.log('(handleNextRepsExercise) Workout finished 1', isLastExerciseCard);
      startNextExercise();
      workoutCycleCompleted();
      updateWorkoutTimer(false);
      updateWorkoutCompleted(true);

      return;
    }

    const isNextExerciseRest = getNextExerciseData()?.type === STRING_DATA.REST;

    if (isNextExerciseRest) {
      disableWorkoutTimer(0);
      boomSoundStartAndPause(() => {
        startNextExercise();
      });
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
        <>
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
            onItemLayoutWrapper={event => onItemLayout(event, index, item.exerciseId)}
          />
        </>
      );
    },
    [selectedIndex, exerciseData],
  );

  // Layout optimization for FlatList
  const getItemLayout = useCallback(
    (data: ArrayLike<ExerciseElement> | null | undefined, index: number) => {
      if (isWeb) {
        return { length: 200, offset: 200 * index, index };
      }
      let offset = 0;
      for (let i = 0; i < index; i++) {
        const itemId = exerciseData?.[i]?.exerciseId;
        offset += itemHeights.current[itemId ?? ''] || ITEM_HEIGHT;
      }

      return {
        length: itemHeights.current[exerciseData?.[index]?.exerciseId ?? ''] || ITEM_HEIGHT,
        offset,
        index,
      };
    },
    [exerciseData],
  );

  useEffect(() => {
    if (selectedIndex >= 0 && selectedIndex < exerciseData.length && flatListRef.current) {
      if (!isWeb) {
        handleScrollBehaviorBasedOnPlatform(selectedIndex);
      }
    }
  }, [containerHeight, selectedIndex, exerciseData]);

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

  function handleScrollBehaviorBasedOnPlatform(nextIndex: number) {
    scrollToIndex(
      flatListRef,
      nextIndex,
      ITEM_HEIGHT,
      CONTAINER_HEIGHT,
      exerciseData.length,
      {
        animated: true,
        viewPosition: 0.5,
      },
      isLargeScreen,
      exerciseData,
    );
  }

  return (
    <>
      {renderButtonInWeb()}
      <FlatList
        ref={flatListRef} // Attach the ref
        data={exerciseData}
        onLayout={e => setContainerHeight(e.nativeEvent.layout.height)}
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
