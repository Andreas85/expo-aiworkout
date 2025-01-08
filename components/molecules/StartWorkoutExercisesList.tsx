import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Platform } from 'react-native';

import { tailwind } from '@/utils/tailwind';
import StartWorkoutExerciseCardWrapper from './StartWorkoutExerciseCardWrapper';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { STRING_DATA } from '@/utils/appConstants';
import { expandRestAsExercisesInExistingExercises } from '@/utils/helper';
import { ExerciseElement } from '@/services/interfaces';

const StartWorkoutExercisesList = (props: any) => {
  const { data, onRefresh = () => {}, refreshing } = props;
  const [exerciseData, setExerciseData] = useState<ExerciseElement[]>([]);
  const flatListRef = useRef<FlatList>(null); // Add ref for the FlatList
  const [selectedIndex, setSelectedIndex] = useState<number>(0); // State to track selected index

  useEffect(() => {
    if (data && data.length > 0) {
      const updateData = expandRestAsExercisesInExistingExercises(data) as ExerciseElement[];
      setExerciseData(updateData);
    }
  }, [data]);

  const { updateWorkoutTimer, updateWorkoutCompleted } = useWorkoutDetailStore();

  const onIncrement = () => {
    console.log('Increment');
  };

  const onDecrement = () => {
    console.log('Decrement');
  };

  const getCurrentExerciseData = () => {
    return data[selectedIndex];
  };

  const getNextExerciseData = () => {
    return data[selectedIndex + 1];
  };

  const startNextExercise = () => {
    console.log('Start Next Exercise');

    setSelectedIndex(prev => prev + 1);

    const index = selectedIndex + 1;
    if (flatListRef.current && index >= 0 && index < data.length) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }

    // centerIndex.value = centerIndex.value + 1;
    // const currentExercise = getCurrentExerciseData()
    // if (!!currentExercise?.reps) {
    //   isRepsAvaliableInExercise.value =
    //     !!currentExercise?.reps;
    // }
    // debouncedScrollIntoView(centerIndex.value);
  };

  // Scroll to a specific item by index
  const scrollToItem = () => {
    const hasReps = getCurrentExerciseData()?.reps;
    const isRest = getNextExerciseData()?.type === STRING_DATA.REST;

    if (selectedIndex + 1 >= exerciseData?.length) {
      console.log('Workout finished 1');
      if (!hasReps) {
        console.log('Workout finished');
        updateWorkoutTimer(false);
        updateWorkoutCompleted(true);
      }
      return;
    }

    startNextExercise();
    // console.log(hasReps, isRest, 'isRest', getNextExerciseData()?.type, getNextExerciseData());

    // if (!hasReps && isRest) {
    //   startNextExercise();
    //   updateWorkoutTimer(true);
    // } else if (!hasReps) {
    //   // preStartNextExercise.value = true;
    // }
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
          isRestCard={item?.type === STRING_DATA.REST}
        />
      );
    },
    [selectedIndex, exerciseData],
  );

  const getItemLayout = (data: any, index: number) => ({
    length: 200, // height of each item
    offset: 100 * index,
    index,
  });

  return (
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
  );
};

export default memo(StartWorkoutExercisesList);
