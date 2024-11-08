import React, { useEffect, useRef, useState } from 'react';
import { ReactSortable } from 'react-sortablejs'; // Import react-sortablejs
import { ExerciseElement } from '@/services/interfaces';
import ExerciseCard from '../atoms/ExerciseCard';
import { Image } from 'expo-image';
import { IMAGES } from '@/utils/images';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { tailwind } from '@/utils/tailwind';
import { useLocalSearchParams } from 'expo-router';
import { sortExercisesRequest } from '@/services/workouts';
import { useMutation } from '@tanstack/react-query';
import { getReorderItemsForSortingWorkoutExercises, queryClient } from '@/utils/helper';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';

// Sortable item component
const SortableItem: React.FC<{
  item: ExerciseElement;
  index: number;
  setIsPendingExerciseCardAction: (loading: boolean) => void;
}> = ({ item, index, setIsPendingExerciseCardAction }) => {
  const handleSubmit = (data: any) => {
    // console.log(data);
  };

  return (
    <ExerciseCard
      key={item?._id}
      data={item}
      handleSubmit={handleSubmit}
      setIsPendingExerciseCardAction={setIsPendingExerciseCardAction}>
      <div className="drag-handle" style={{ cursor: 'grab' }}>
        <em>
          <Image source={IMAGES.dragDot} contentFit="contain" style={tailwind(' h-5 w-5 ')} />
        </em>
      </div>
    </ExerciseCard>
  );
};

const DraggableExercises = (props: {
  setIsPendingExerciseCardAction: (loading: boolean) => void;
}) => {
  const { setIsPendingExerciseCardAction } = props;
  const { setWorkoutDetail } = useWorkoutDetailStore();
  const { slug } = useLocalSearchParams() as any;
  const exercisesList = useWorkoutDetailStore(state => state.workoutDetail)?.exercises ?? [];

  // Sort exercises by the 'order' key

  const [items, setItems] = useState<any[]>([...exercisesList].sort((a, b) => a.order - b.order));

  useEffect(() => {
    const sortedExercisesList = [...exercisesList].sort((a, b) => a.order - b.order);
    setItems(sortedExercisesList);
  }, [exercisesList]);

  const { mutate: mutateSortExercise, isPending } = useMutation({
    mutationFn: sortExercisesRequest,
    onSuccess: async data => {
      queryClient.setQueryData([REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug], data?.data);
      setWorkoutDetail(data?.data);
    },
  });

  useEffect(() => {
    setIsPendingExerciseCardAction(isPending);
  }, [isPending]);

  const handleDragOnEnd = (event: any) => {
    const { oldIndex, newIndex } = event;
    // Manually reorder the items array
    const reorderedItems = [...items];
    const [movedItem] = reorderedItems.splice(oldIndex, 1); // Remove the dragged item from old index
    reorderedItems.splice(newIndex, 0, movedItem); // Insert it at the new index

    const modifiedData = getReorderItemsForSortingWorkoutExercises(reorderedItems);
    const payload = {
      queryParams: { id: slug },
      formData: { ...modifiedData },
    };
    mutateSortExercise(payload);
    console.log(oldIndex, newIndex, 'ORDER CHANGE', reorderedItems);
  };

  // Reference to the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollThreshold = 50; // Distance from the edge where auto-scroll should start
  const scrollSpeed = 5; // Pixels to scroll per frame

  // Function to handle reordering of items
  const handleOrderChange = (newOrder: ExerciseElement[]) => {
    setItems(newOrder);
  };

  // Function to handle auto-scroll for both mouse and touch
  const autoScroll = (event: MouseEvent | TouchEvent) => {
    const container = scrollContainerRef.current;

    if (!container) return;

    let clientY;
    if (event instanceof TouchEvent) {
      clientY = event.touches[0].clientY; // Get Y-coordinate from touch events
    } else {
      clientY = event.clientY; // Get Y-coordinate from mouse events
    }

    const { top, bottom } = container.getBoundingClientRect();

    // Scroll up if near the top
    if (clientY < top + scrollThreshold) {
      container.scrollTop -= scrollSpeed;
    }

    // Scroll down if near the bottom
    if (clientY > bottom - scrollThreshold) {
      container.scrollTop += scrollSpeed;
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (container) {
      // Add event listeners for both mouse and touch events to trigger auto-scroll
      container.addEventListener('dragover', autoScroll); // Desktop
      container.addEventListener('touchmove', autoScroll); // Mobile
    }

    return () => {
      if (container) {
        container.removeEventListener('dragover', autoScroll);
        container.removeEventListener('touchmove', autoScroll);
      }
    };
  }, []);

  return (
    <div
      className="space-y-1 overflow-x-hidden overflow-y-scroll pb-40"
      ref={scrollContainerRef}
      style={{ maxHeight: '80vh' }}>
      <ReactSortable
        list={items} // List of items to sort
        setList={handleOrderChange} // Function to update the list when items are moved
        onEnd={handleDragOnEnd} // Callback after reordering
        handle=".drag-handle"
        className="space-y-1 overflow-x-hidden overflow-y-scroll">
        {items.map((item, index) => (
          <div key={item?._id} data-id={item?._id + index?.toString()}>
            <SortableItem
              item={item}
              index={index}
              setIsPendingExerciseCardAction={setIsPendingExerciseCardAction}
            />
          </div>
        ))}
      </ReactSortable>
    </div>
  );
};

export default DraggableExercises;
