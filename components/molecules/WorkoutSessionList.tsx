import React, { useCallback, memo } from 'react';
import { FlatList, Pressable, Platform, View, Text } from 'react-native';
import { tailwind } from '@/utils/tailwind';
import Container from '../atoms/Container';
import ImageContainer from '../atoms/ImageContainer';
import TextContainer from '../atoms/TextContainer';
import useBreakPoints from '@/hooks/useBreakPoints';
import { IMAGES } from '@/utils/images';
import { getStatusColor } from '@/utils/helper';
import WorkoutStatus from '../atoms/WorkoutStatus';

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
  onItemPress,
  isEnabled,
  onRefresh,
  keyName,
  isMyWorkout,
}: WorkoutListProps) => {
  const { isMediumScreen } = useBreakPoints();

  // Memoize the renderItem to avoid re-renders
  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
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
      return (
        <Pressable
          style={[
            Platform.select({
              web: tailwind('flex-1'),
              native: tailwind('mb-2 flex-1'),
            }),
          ]}
          onPress={() => onItemPress(item)}
          key={item._id}>
          <Container
            style={[
              Platform.select({
                web: tailwind(
                  `relative h-full w-full flex-1 grow cursor-pointer self-center ${isEnabled ? 'rounded-lg bg-NAVBAR_BACKGROUND' : ''}`,
                ),
                native: tailwind(
                  `${isEnabled ? 'rounded-lg bg-NAVBAR_BACKGROUND' : ''} h-full flex-1 grow`,
                ),
              }),
            ]}>
            {/* Workout Status */}
            <View
              style={tailwind(
                'absolute right-2 top-2 z-40 mb-2 flex-row items-center justify-center',
              )}>
              <WorkoutStatus itemStatus={item?.status?.toUpperCase() as 'COMPLETED' | 'PENDING'} />
            </View>

            {!isEnabled && (
              <ImageContainer
                source={IMAGES.fitness}
                styleNative={[tailwind(`aspect-square w-full self-center rounded-2xl`)]}
                contentFit="fill"
              />
            )}
            {/* Workout Details */}
            <Container style={tailwind('mt-2')}>
              <TextContainer
                data={item?.name || 'Workout Name'}
                style={[
                  tailwind('text-center text-base font-semibold'),
                  Platform.select({
                    web: tailwind('text-lg'),
                    native: tailwind('text-base'),
                  }),
                ]}
              />
            </Container>
          </Container>
        </Pressable>
      );
    },
    [data, isEnabled, onItemPress],
  );

  return (
    <FlatList
      data={data}
      numColumns={numColumns}
      keyExtractor={item => item?._id || keyName}
      key={numColumns}
      initialNumToRender={4}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={50}
      renderItem={renderItem}
      refreshing={isPending}
      onRefresh={onRefresh}
      contentContainerStyle={[
        Platform.select({
          web: tailwind(`${isMediumScreen ? 'gap-y-4 py-4 pt-0' : 'gap-y-4 py-2 pt-0'}`),
        }),
      ]}
      removeClippedSubviews={true}
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
export default memo(WorkoutSessionList);
