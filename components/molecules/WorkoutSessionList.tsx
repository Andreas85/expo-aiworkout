import React, { useCallback } from 'react';
import { FlatList, Platform } from 'react-native';
import { tailwind } from '@/utils/tailwind';
import useBreakPoints from '@/hooks/useBreakPoints';
import WorkoutSessionCard from '../atoms/WorkoutSessionCard';
import WorkoutSessionShortVersionCard from '../atoms/WorkoutSessionShortVersionCard';
import Container from '../atoms/Container';
import { WorkoutSessionResponseData } from '@/services/interfaces';

interface WorkoutListProps {
  data: any[];
  isPending?: boolean;
  numColumns: number;
  onItemPress: (item: any) => void;
  isEnabled?: boolean;
  onRefresh?: () => void;
  isMyWorkout?: boolean;
  keyName?: string;
}

const WorkoutSessionList = ({
  data,
  isPending,
  numColumns,
  isEnabled,
  onRefresh,
}: WorkoutListProps) => {
  const { isMediumScreen } = useBreakPoints();
  const MemoizedWorkoutSessionCard = React.memo(WorkoutSessionCard);
  const MemoizedWorkoutSessionCardShort = React.memo(WorkoutSessionShortVersionCard);

  // Memoize the renderItem to avoid re-renders
  const renderListItem = useCallback(
    ({
      item,
      index,
    }: {
      item: WorkoutSessionResponseData & { isPlaceholder?: boolean };
      index: number;
    }) => {
      if (index >= data?.length) return null;
      if (item?.isPlaceholder) {
        return (
          <Container
            style={[
              Platform.select({
                web: tailwind('relative h-full w-full flex-1'),
                native: tailwind('flex-1'),
              }),
            ]}
          />
        );
      }
      return <MemoizedWorkoutSessionCard key={item?._id} item={item} />;
    },
    [],
  );

  const renderListItemIsShortVersion = useCallback(
    ({ item, index }: { item: WorkoutSessionResponseData; index: number }) => {
      return <MemoizedWorkoutSessionCardShort item={item} />;
    },
    [],
  );

  if (isEnabled) {
    return (
      <FlatList
        data={data}
        numColumns={!isMediumScreen ? numColumns : undefined}
        keyExtractor={(item, index) =>
          item?._id?.toString() + 'is-workout-session-short-version' + index.toString()
        }
        key={`${numColumns}-${isEnabled}`}
        initialNumToRender={4}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        renderItem={renderListItemIsShortVersion}
        refreshing={isPending}
        onRefresh={onRefresh}
        contentContainerStyle={[
          Platform.select({
            web: tailwind(`${isMediumScreen ? 'gap-y-4 py-4 pt-0' : 'gap-y-4 py-2 pt-0'}`),
            // native: tailwind('flex-1 gap-y-4 py-2 pt-0'),
          }),
        ]}
        columnWrapperStyle={
          !isMediumScreen && {
            flex: 1,
            columnGap: 20,
            rowGap: 20,
            justifyContent: 'space-evenly',
          }
        }
        // removeClippedSubviews={true}
        onEndReachedThreshold={0.5}
        getItemLayout={(data, index) => ({
          length: 150,
          offset: 150 * index,
          index,
        })}
      />
    );
  }

  return (
    <FlatList
      data={data}
      numColumns={numColumns}
      keyExtractor={(item, index) =>
        item?._id?.toString() + 'is-workout-session-full-version' + index.toString()
      }
      key={`${numColumns}-${isEnabled}`}
      initialNumToRender={4}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={50}
      renderItem={renderListItem}
      refreshing={isPending}
      onRefresh={onRefresh}
      contentContainerStyle={[
        Platform.select({
          web: tailwind(`${isMediumScreen ? 'gap-y-4 py-4 pt-0' : 'gap-y-4 py-2 pt-0'}`),
        }),
      ]}
      // removeClippedSubviews={true}
      onEndReachedThreshold={0.5}
      columnWrapperStyle={{
        flex: 1,
        columnGap: 20,
        rowGap: 20,
        justifyContent: 'space-evenly',
      }}
      getItemLayout={(data, index) => ({
        length: 150,
        offset: 150 * index,
        index,
      })}
    />
  );
};

// Memoize WorkoutList to prevent re-renders on unchanged props
export default WorkoutSessionList;
