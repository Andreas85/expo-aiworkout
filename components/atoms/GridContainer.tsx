import React, { ComponentType, JSXElementConstructor, ReactElement } from 'react';
import { View } from '../Themed';
import { FlatList, ListRenderItem, RefreshControl, StyleProp, ViewStyle } from 'react-native';
import { tailwind } from '@/utils/tailwind';
import useBreakPoints from '@/hooks/useBreakPoints';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GridContainer(props: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>; // for native styling
  data: any[];
  renderListHeaderComponent?:
    | ReactElement<any, string | JSXElementConstructor<any>>
    | ComponentType<any>
    | null
    | undefined;
  listNumColumnsNative?: number;
  className?: string; // for web styling (used in .web.tsx)
  renderListItemInNative: (data: any) => React.ReactElement;
  keyExtractorNative: ((item: any, index: number) => string) | undefined;
  refreshingNative: boolean;
  onRefresh?: () => void;
}) {
  const {
    data,
    listNumColumnsNative,
    renderListItemInNative,
    keyExtractorNative,
    renderListHeaderComponent,
    onRefresh,
    refreshingNative = false,
  } = props;
  const { isMediumScreen } = useBreakPoints();
  const insets = useSafeAreaInsets();
  const renderItem: ListRenderItem<any> = ({ item }: { item: any }) => renderListItemInNative(item);

  // This component is used to separate items in the list
  const ItemSeparator = () => (
    <View
      style={{
        height: 10, // Height of the separator
        backgroundColor: 'transparent', // No color, just adds spacing
      }}
    />
  );
  return (
    <FlatList
      data={data}
      numColumns={listNumColumnsNative}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={renderListHeaderComponent}
      key={listNumColumnsNative}
      contentContainerStyle={[
        tailwind(`${isMediumScreen ? 'gap-y-4 py-4' : 'gap-y-4 py-2 '}`),
        { paddingBottom: insets.bottom },
      ]}
      renderItem={renderItem}
      keyExtractor={keyExtractorNative}
      columnWrapperStyle={{
        flex: 1,
        columnGap: 20,
        justifyContent: 'space-around',
      }}
      ItemSeparatorComponent={ItemSeparator}
      refreshControl={<RefreshControl refreshing={refreshingNative} onRefresh={onRefresh} />}
    />
  );
}
