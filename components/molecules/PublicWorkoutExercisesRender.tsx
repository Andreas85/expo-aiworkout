import React, { memo, useCallback } from 'react';
import { FlatList, Platform, View } from 'react-native';

import WorkoutCardShort from '../atoms/WorkoutCardShort';
import Container from '../atoms/Container';
import TextContainer from '../atoms/TextContainer';

import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { tailwind } from '@/utils/tailwind';

const PublicWorkoutExercisesRender = ({
  data,
  isEnabled = false,
  onRefresh = () => {},
  refreshing,
}: any) => {
  const { isLargeScreen } = useWebBreakPoints();
  const MemoizedWorkoutCardShort = memo(WorkoutCardShort);

  const renderItem = useCallback(
    ({ item }: { item: any }) => <MemoizedWorkoutCardShort item={item} />,
    [],
  );

  const renderHeader = () => (
    <>
      <Container
        style={[
          Platform.select({
            web: tailwind(
              isLargeScreen
                ? 'flex-row justify-between rounded-lg px-3 py-2'
                : 'flex-row justify-between py-5',
            ),
            native: tailwind('flex-row justify-between rounded-lg py-2'),
          }),
        ]}>
        <TextContainer
          data={'Exercises'}
          style={[
            Platform.select({
              web: tailwind(
                isLargeScreen ? 'w-[47%] text-[0.875rem] font-bold' : 'w-[56%] text-[1.5rem]',
              ),
              native: tailwind('w-[47%] text-[0.875rem] font-bold'),
            }),
          ]}
          numberOfLines={1}
        />
        <TextContainer
          data={'No. of Reps'}
          style={[
            Platform.select({
              web: tailwind(
                isLargeScreen ? 'w-[27%] text-[0.875rem] font-bold' : 'w-[24%] text-[1.5rem]',
              ),
              native: tailwind('w-[27%] text-[0.875rem] font-bold'),
            }),
          ]}
          numberOfLines={1}
        />
        <TextContainer
          data={'Rest'}
          style={[
            Platform.select({
              web: tailwind(isLargeScreen ? 'w-[30%] text-[0.875rem] font-bold' : 'text-[1.5rem]'),
              native: tailwind('w-[30%] text-center text-[0.875rem] font-bold'),
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
            tailwind('border-none border-white'),
          ]}
        />
      )}
    </>
  );

  return (
    <FlatList
      data={data}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={50}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => '-short-' + index}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={[
        Platform.select({
          web: tailwind(
            `gap-y-4 overflow-y-scroll rounded bg-NAVBAR_BACKGROUND pb-24 ${
              isLargeScreen ? 'rounded-lg px-3 pt-2' : 'px-[2.5rem] pt-[1.25rem]'
            }`,
          ),
          native: tailwind('gap-y-4 rounded-lg bg-NAVBAR_BACKGROUND px-3 py-2'),
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
