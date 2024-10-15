import { ExerciseElement } from '@/services/interfaces';
import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import 'react-native-gesture-handler';

const NUM_ITEMS = 10;
function getColor(i: number) {
  const multiplier = 255 / (NUM_ITEMS - 1);
  const colorVal = i * multiplier;
  return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

type Item = {
  key: string;
  label: string;
  height: number;
  width: number;
  backgroundColor: string;
};

const initialData: Item[] = [...Array(NUM_ITEMS)].map((d, index) => {
  const backgroundColor = getColor(index);
  return {
    key: `item-${index}`,
    label: String(index) + '',
    height: 100,
    width: 60 + Math.random() * 40,
    backgroundColor,
  };
});

const DraggableExercises = (props: { exercisesData: ExerciseElement[] }) => {
  const { exercisesData } = props;
  const [data, setData] = useState<ExerciseElement[]>(initialData);

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onPressIn={Platform.OS === 'web' ? drag : undefined}
          onLongPress={Platform.OS !== 'web' ? drag : undefined}
          onPress={() => console.log('onPress', item.label)}
          disabled={isActive}
          style={[styles.rowItem, { backgroundColor: isActive ? 'red' : item.backgroundColor }]}>
          <Text style={styles.text}>{item.label}</Text>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <>
      <DraggableFlatList
        data={data}
        onDragEnd={({ data }) => setData(data)}
        keyExtractor={item => item?.key}
        renderItem={renderItem}
        scrollEnabled={true}
      />
    </>
  );
};
export default DraggableExercises;

const styles = StyleSheet.create({
  rowItem: {
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
