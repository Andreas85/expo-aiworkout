import { ExerciseElement } from '@/services/interfaces';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import React, { useEffect, useState } from 'react';
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
import { getReorderItemsForSortingWorkoutExercises } from '@/utils/helper';
import { useMutation } from '@tanstack/react-query';
import { sortExercisesRequest } from '@/services/workouts';
import { useLocalSearchParams } from 'expo-router';
import { useToast } from 'react-native-toast-notifications';

const DraggableExercises = (props: {}) => {
  // const { exercisesData } = props;
  const { setWorkoutDetail } = useWorkoutDetailStore();
  const { slug } = useLocalSearchParams() as any;
  const toast = useToast();
  const exercisesList = useWorkoutDetailStore(state => state.workoutDetail)?.exercises ?? [];
  const [data, setData] = useState<ExerciseElement[]>([]);

  useEffect(() => {
    const sortedExercisesList = [...exercisesList].sort((a, b) => a.order - b.order);
    setData(sortedExercisesList);
  }, [exercisesList]);

  const { mutate: mutateSortExercise } = useMutation({
    mutationFn: sortExercisesRequest,
    onSuccess: async data => {
      toast.show('Updated order of exercises', { type: 'success' });
      setWorkoutDetail(data?.data);
    },
  });

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

  const handleDragEnd = ({ data }: any) => {
    // console.log(data, 'DATA');
    const modifiedData = getReorderItemsForSortingWorkoutExercises(data);
    const payload = {
      queryParams: { id: slug },
      formData: { ...modifiedData },
    };
    // console.log(itemOrder);
    mutateSortExercise(payload);
    setData(data);
  };

  return (
    <>
      <DraggableFlatList
        data={data}
        onDragEnd={handleDragEnd}
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
