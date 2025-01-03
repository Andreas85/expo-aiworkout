import React, { memo, useCallback } from 'react';
import { FlatList, Platform } from 'react-native';

import WorkoutCard from '../atoms/WorkoutCard';
import { tailwind } from '@/utils/tailwind';
import Container from '../atoms/Container';

import WorkoutCardShort from '../atoms/WorkoutCardShort';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import TextContainer from '../atoms/TextContainer';

const PublicWorkoutExercisesRender = (props: any) => {
  const { data, isEnabled = false, onRefresh = () => {}, refreshing } = props;
  const { isLargeScreen } = useWebBreakPoints();
  const MemoizedWorkoutCard = React.memo(WorkoutCard);
  const MemoizedWorkoutCardShort = React.memo(WorkoutCardShort);

  // Memoize the renderItem to avoid re-renders
  const renderListItem = useCallback(({ item, index }: { item: any; index: number }) => {
    return <MemoizedWorkoutCard key={item?._id} item={item} />;
  }, []);

  const renderListItemIsShortVersion = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      return <MemoizedWorkoutCardShort item={item} />;
    },
    [],
  );

  const renderHeader = () => {
    return (
      <>
        <Container
          style={[
            Platform.select({
              web: tailwind(
                ` ${isLargeScreen ? ' justify-between rounded-lg px-3 py-2' : ' py-5'} flex-row  `,
              ),
              native: tailwind('flex-row  justify-between  rounded-lg py-2'),
            }),
          ]}>
          <TextContainer
            data={'Exercises'}
            style={[
              Platform.select({
                web: tailwind(
                  ` ${isLargeScreen ? 'w-[47%]  text-[0.875rem] font-bold' : 'w-[56%] text-[1.5rem]'}   `,
                ),
                native: tailwind(' w-[47%] text-[0.875rem]  font-bold'),
              }),
            ]}
            numberOfLines={1}
          />
          <TextContainer
            data={'No. of Reps'}
            style={[
              Platform.select({
                web: tailwind(
                  ` ${isLargeScreen ? 'w-[27%] text-[0.875rem] font-bold' : 'w-[24%] text-[1.5rem]'}  `,
                ),
                native: tailwind('w-[27%]  text-[0.875rem]  font-bold'),
              }),
            ]}
            numberOfLines={1}
          />
          <TextContainer
            data={'Rest'}
            style={[
              Platform.select({
                web: tailwind(
                  `${isLargeScreen ? 'w-[30%] text-[0.875rem] font-bold ' : ' text-[1.5rem]'} `,
                ),
                native: tailwind('w-[30%]  text-center  text-[0.875rem] font-bold '),
              }),
            ]}
            numberOfLines={1}
          />
        </Container>
        {!isLargeScreen && (
          <Container
            style={[
              Platform.select({
                web: tailwind('border-b-[0.1px] opacity-10'),
                native: tailwind('border-[0.25px] opacity-25'),
              }),
              tailwind('border-none border-white '),
            ]}
          />
        )}
      </>
    );
  };

  if (isEnabled) {
    return (
      <FlatList
        data={data}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        updateCellsBatchingPeriod={50}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item?._id.toString() + 'is-short-version' + index.toString()}
        ListHeaderComponent={renderHeader}
        renderItem={renderListItemIsShortVersion}
        contentContainerStyle={[
          Platform.select({
            web: tailwind(
              ` gap-y-4 overflow-y-scroll rounded bg-NAVBAR_BACKGROUND pb-24  ${isLargeScreen ? 'rounded-lg px-3 pt-2 ' : 'px-[2.5rem] pt-[1.25rem]'}`,
            ),
            native: tailwind(` gap-y-4 rounded-lg bg-NAVBAR_BACKGROUND  px-3 py-2`),
          }),
        ]}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
      />
    );
  }

  return (
    <FlatList
      data={data}
      initialNumToRender={1}
      maxToRenderPerBatch={1}
      updateCellsBatchingPeriod={50}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => item?._id.toString() + 'is-full-version' + index.toString()}
      renderItem={renderListItem}
      contentContainerStyle={[
        Platform.select({
          web: tailwind(
            ` ${isLargeScreen ? 'gap-[0.5rem]' : 'gap-[1.25rem] '} overflow-y-scroll pb-24 `,
          ),
          native: tailwind(` gap-y-4 py-4 pt-0 `),
        }),
      ]}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReachedThreshold={0.5}
      removeClippedSubviews={true}
    />
  );
};

export default memo(PublicWorkoutExercisesRender);
