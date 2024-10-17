import React, { useEffect, useRef, useState } from 'react';
import { ReactSortable } from 'react-sortablejs'; // Import react-sortablejs
import { ExerciseElement } from '@/services/interfaces';
import ExerciseCard from '../atoms/ExerciseCard';
import { Image } from 'expo-image';
import { IMAGES } from '@/utils/images';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { tailwind } from '@/utils/tailwind';

// Sortable item component
const SortableItem: React.FC<{ item: ExerciseElement }> = ({ item }) => {
  const handleSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <ExerciseCard data={item} handleSubmit={handleSubmit}>
      <div className="drag-handle" style={{ cursor: 'grab' }}>
        <em>
          <Image source={IMAGES.dragDot} contentFit="contain" style={tailwind(' h-5 w-5 ')} />
        </em>
      </div>
    </ExerciseCard>
  );
};

const DraggableExercises = (props: {}) => {
  const exercisesList = useWorkoutDetailStore(state => state.workoutDetail)?.exercises ?? [];
  const [items, setItems] = useState<any[]>(exercisesList);

  const handleDragOnEnd = (event: any) => {
    const { oldIndex, newIndex } = event;
    console.log(oldIndex, newIndex, 'ORDER CHANGE');
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
      className="space-y-1 overflow-x-hidden overflow-y-scroll"
      ref={scrollContainerRef}
      style={{ maxHeight: '80vh' }}>
      <ReactSortable
        list={items} // List of items to sort
        setList={handleOrderChange} // Function to update the list when items are moved
        onEnd={handleDragOnEnd} // Callback after reordering
        handle=".drag-handle"
        className="space-y-1 overflow-x-hidden overflow-y-scroll">
        {items.map(item => (
          <div key={item?._id} data-id={item?._id}>
            <SortableItem item={item} />
          </div>
        ))}
      </ReactSortable>
    </div>
  );
};

export default DraggableExercises;
