import React, { memo, useCallback } from 'react';
import { FlatList, Platform } from 'react-native';

import { tailwind } from '@/utils/tailwind';
import StartWorkoutExerciseCardWrapper from './StartWorkoutExerciseCardWrapper';

const StartWorkoutExercisesList = (props: any) => {
  const { data, onRefresh = () => {}, refreshing } = props;

  const MemoizedStartWorkoutExerciseCardWrapper = React.memo(StartWorkoutExerciseCardWrapper);
  const onIncrement = () => {
    console.log('Increment');
  };

  const onDecrement = () => {
    console.log('Decrement');
  };

  // Memoize the renderItem to avoid re-renders
  const renderListItem = useCallback(({ item, index }: { item: any; index: number }) => {
    // return <WorkoutCard key={item?._id} item={item} />;
    return (
      <MemoizedStartWorkoutExerciseCardWrapper
        key={item?._id}
        exercise={item}
        isLast={false}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />
    );
  }, []);

  // const renderListItemIsShortVersion = useCallback(
  //   ({ item, index }: { item: any; index: number }) => {
  //     return (
  //       <MemoizedStartWorkoutExerciseCardWrapper
  //         key={item?._id}
  //         exercise={item}
  //         isLast={false}
  //         onIncrement={onIncrement}
  //         onDecrement={onDecrement}
  //       />
  //     );
  //   },
  //   [data, key],
  // );

  // const renderHeader = () => {
  //   return (
  //     <>
  //       <Container
  //         style={[
  //           Platform.select({
  //             web: tailwind(
  //               ` ${isLargeScreen ? ' justify-between rounded-lg px-3 py-2' : ' py-5'} flex-row  `,
  //             ),
  //             native: tailwind('flex-row  justify-between  rounded-lg py-2'),
  //           }),
  //         ]}>
  //         <TextContainer
  //           data={'Exercises'}
  //           style={[
  //             Platform.select({
  //               web: tailwind(
  //                 ` ${isLargeScreen ? 'w-[47%]  text-[0.875rem] font-bold' : 'w-[56%] text-[1.5rem]'}   `,
  //               ),
  //               native: tailwind(' w-[47%] text-[0.875rem]  font-bold'),
  //             }),
  //           ]}
  //           numberOfLines={1}
  //         />
  //         <TextContainer
  //           data={'No. of Reps'}
  //           style={[
  //             Platform.select({
  //               web: tailwind(
  //                 ` ${isLargeScreen ? 'w-[27%] text-[0.875rem] font-bold' : 'w-[24%] text-[1.5rem]'}  `,
  //               ),
  //               native: tailwind('w-[27%]  text-[0.875rem]  font-bold'),
  //             }),
  //           ]}
  //           numberOfLines={1}
  //         />
  //         <TextContainer
  //           data={'Rest'}
  //           style={[
  //             Platform.select({
  //               web: tailwind(
  //                 `${isLargeScreen ? 'w-[30%] text-[0.875rem] font-bold ' : ' text-[1.5rem]'} `,
  //               ),
  //               native: tailwind('w-[30%]  text-center  text-[0.875rem] font-bold '),
  //             }),
  //           ]}
  //           numberOfLines={1}
  //         />
  //       </Container>
  //       {!isLargeScreen && (
  //         <Container
  //           style={[
  //             Platform.select({
  //               web: tailwind('border-b-[0.1px] opacity-10'),
  //               native: tailwind('border-[0.25px] opacity-25'),
  //             }),
  //             tailwind('border-none border-white '),
  //           ]}
  //         />
  //       )}
  //     </>
  //   );
  // };

  // if (isEnabled) {
  //   return (
  //     <FlatList
  //       data={data}
  //       initialNumToRender={1}
  //       maxToRenderPerBatch={1}
  //       updateCellsBatchingPeriod={50}
  //       showsVerticalScrollIndicator={false}
  //       keyExtractor={(item, index) => item?._id.toString() + 'is-short-version' + index.toString()}
  //       ListHeaderComponent={renderHeader}
  //       renderItem={renderListItemIsShortVersion}
  //       contentContainerStyle={[
  //         Platform.select({
  //           web: tailwind(
  //             ` gap-y-4 overflow-y-scroll rounded bg-NAVBAR_BACKGROUND pb-24  ${isLargeScreen ? 'rounded-lg px-3 pt-2 ' : 'px-[2.5rem] pt-[1.25rem]'}`,
  //           ),
  //           native: tailwind(` gap-y-4 rounded-lg bg-NAVBAR_BACKGROUND  px-3 py-2`),
  //         }),
  //       ]}
  //       refreshing={refreshing}
  //       onRefresh={onRefresh}
  //       onEndReachedThreshold={0.5}
  //       removeClippedSubviews={true}
  //       // windowSize={10} // Adjust based on the number of items visible on screen
  //     />
  //   );
  // }

  const getItemLayout = (data: any, index: number) => ({
    length: 100, // height of each item
    offset: 100 * index,
    index,
  });

  return (
    <FlatList
      data={data}
      initialNumToRender={7}
      maxToRenderPerBatch={7}
      updateCellsBatchingPeriod={50}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => item?._id.toString() + 'is-full-version' + index.toString()}
      renderItem={renderListItem}
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
