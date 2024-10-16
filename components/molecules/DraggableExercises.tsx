import { ExerciseElement } from '@/services/interfaces';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import React, { useState } from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import 'react-native-gesture-handler';
import { tailwind } from '@/utils/tailwind';
import { Image } from 'expo-image';
import { IMAGES } from '@/utils/images';
import ExerciseCard from '../atoms/ExerciseCard';

const DraggableExercises = (props: {}) => {
  // const { exercisesData } = props;
  const exercisesList = useWorkoutDetailStore(state => state.workoutDetail)?.exercises ?? [];
  const [data, setData] = useState<ExerciseElement[]>(exercisesList);

  const renderItem = ({ item, drag, isActive }: RenderItemParams<ExerciseElement>) => {
    return (
      <>
        <ScaleDecorator>
          <ExerciseCard data={item} handleSubmit={() => {}}>
            <TouchableOpacity
              onPressIn={Platform.OS === 'web' ? drag : undefined}
              onLongPress={Platform.OS !== 'web' ? drag : undefined}
              onPress={() => console.log('onPress', item.exercise.name)}
              disabled={isActive}>
              <Image source={IMAGES.dragDot} contentFit="contain" style={tailwind(' h-5 w-5 ')} />
            </TouchableOpacity>
          </ExerciseCard>
        </ScaleDecorator>
      </>
    );
  };

  return (
    <>
      <DraggableFlatList
        data={data}
        onDragEnd={({ data }) => setData(data)}
        keyExtractor={item => item?._id}
        style={{
          marginBottom: 55,
        }}
        renderItem={renderItem}
        scrollEnabled={true}
      />
    </>
  );
};
export default DraggableExercises;
