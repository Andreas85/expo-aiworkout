import React, { useCallback, memo } from 'react';
import { FlatList, Pressable, Platform } from 'react-native';
import { tailwind } from '@/utils/tailwind';
import Container from '../atoms/Container';
import ImageContainer from '../atoms/ImageContainer';
import TextContainer from '../atoms/TextContainer';
import useBreakPoints from '@/hooks/useBreakPoints';
import { IMAGES } from '@/utils/images';
import usePlatform from '@/hooks/usePlatform';

interface WorkoutListProps {
  data: any[];
  isPending?: boolean;
  numColumns: number;
  onItemPress: (item: any) => void;
  isEnabled: boolean;
  onRefresh?: () => void;
  isMyWorkout?: boolean;
  keyName?: string;
}

const WorkoutList = ({
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
  const { isWeb } = usePlatform();
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
            {!isEnabled && (
              <ImageContainer
                source={IMAGES.fitness}
                styleNative={[tailwind(`aspect-square w-full self-center rounded-2xl`)]}
                contentFit="fill"
              />
            )}
            <TextContainer
              data={item?.name}
              style={[
                Platform.select({
                  web: tailwind(`h-full w-full text-center ${isEnabled ? 'my-4' : 'mt-4'}`),
                  native: tailwind(`my-4 flex-1 bg-transparent px-1 px-2 text-center`),
                }),
              ]}
            />
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
      key={`${numColumns}-${isEnabled}`}
      initialNumToRender={isWeb ? undefined : 4}
      maxToRenderPerBatch={isWeb ? undefined : 5}
      updateCellsBatchingPeriod={isWeb ? undefined : 50}
      renderItem={renderItem}
      refreshing={isPending}
      onRefresh={onRefresh}
      contentContainerStyle={[
        Platform.select({
          web: tailwind(`${isMediumScreen ? 'gap-y-4 py-4 pt-0' : 'gap-y-4 py-2 pt-0'}`),
        }),
      ]}
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
export default memo(WorkoutList);
