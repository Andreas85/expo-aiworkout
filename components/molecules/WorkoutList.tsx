import React from 'react';
import { FlatList, Pressable, Platform } from 'react-native';
import { tailwind } from '@/utils/tailwind';

import { IMAGES } from '@/utils/images';
import Container from '../atoms/Container';
import ImageContainer from '../atoms/ImageContainer';
import TextContainer from '../atoms/TextContainer';
import useBreakPoints from '@/hooks/useBreakPoints';

interface WorkoutListProps {
  data: any[];
  isPending: boolean;
  numColumns: number;
  onItemPress: (item: any) => void;
  isEnabled: boolean;
  onRefresh: () => void;
  isMyWorkout?: boolean;
  keyName?: string;
}

export default function WorkoutList({
  data,
  isPending,
  numColumns,
  onItemPress,
  isEnabled,
  onRefresh,
  keyName,
  isMyWorkout,
}: WorkoutListProps) {
  const { isMediumScreen } = useBreakPoints();
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    if (index >= data?.length) {
      return null; // Avoid out-of-bounds access
    }
    if (item?.isPlaceholder) {
      return (
        <Container
          style={[
            Platform.select({
              web: tailwind(`relative h-full w-full flex-1`),
              native: tailwind(`flex-1`),
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
            native: tailwind('mb-2 flex-1 '),
          }),
        ]}
        onPress={() => onItemPress(item)}>
        <Container
          style={[
            Platform.select({
              web: tailwind(
                `relative h-full w-full flex-1 grow cursor-pointer self-center ${isEnabled ? 'rounded-lg bg-NAVBAR_BACKGROUND' : ''}`,
              ),
              native: tailwind(
                `${isEnabled ? 'rounded-lg bg-NAVBAR_BACKGROUND' : ''} h-full flex-1 grow `,
              ),
            }),
          ]}>
          {!isEnabled && (
            <ImageContainer
              source={IMAGES.logo}
              styleNative={[tailwind(`aspect-square w-full self-center rounded-2xl`)]}
              contentFit="fill"
            />
          )}
          <TextContainer
            data={item?.name}
            style={[
              Platform.select({
                web: tailwind(`h-full w-full text-center ${isEnabled ? 'my-4' : 'mt-4'}`),
                native: tailwind(`my-4 flex-1  bg-transparent  px-1 px-2 text-center`),
              }),
            ]}
          />
        </Container>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={data}
      numColumns={numColumns}
      keyExtractor={item => item?._id + Math.random().toString() + keyName}
      key={numColumns}
      renderItem={renderItem}
      refreshing={isPending}
      onRefresh={onRefresh}
      //   ListFooterComponent={<View style={{ height: 20, backgroundColor: 'yellow' }} />}
      contentContainerStyle={[
        Platform.select({
          web: tailwind(`${isMediumScreen ? 'gap-y-4 py-4 pt-0' : 'gap-y-4 py-2 pt-0'}`),
          //   native: tailwind(`py-4`),
        }),
      ]}
      //   extraData={data}
      removeClippedSubviews={false}
      onEndReachedThreshold={0.5}
      columnWrapperStyle={{
        flex: 1,
        columnGap: 20,
        rowGap: 20,
        // backgroundColor: 'green',
        justifyContent: 'space-evenly',
      }}
      getItemLayout={(data, index) => ({
        length: 150, // Fixed height of each item
        offset: 150 * index, // Position of each item
        index,
      })}
    />
  );
}
