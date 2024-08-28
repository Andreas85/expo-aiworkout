import React from 'react';
import { View } from '../Themed';
import { FlatList, ListRenderItem, StyleProp, ViewStyle } from 'react-native';

export default function GridContainer(props: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>; // for native styling
  data: any[];
  listNumColumnsNative?: number;
  className?: string; // for web styling (used in .web.tsx)
  renderListItemInNative: (data: any) => React.ReactElement;
  keyExtractorNative: ((item: any, index: number) => string) | undefined;
}) {
  const { data, listNumColumnsNative, renderListItemInNative, keyExtractorNative } = props;

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
      renderItem={renderItem}
      keyExtractor={keyExtractorNative}
      columnWrapperStyle={{
        flex: 1,
        justifyContent: 'space-around',
      }}
      ItemSeparatorComponent={ItemSeparator}
    />
  );
}
