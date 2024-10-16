import React, { useState } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ExerciseElement } from '@/services/interfaces';
import ExerciseCard from '../atoms/ExerciseCard';
import { tailwind } from '@/utils/tailwind';

import { Image } from 'expo-image';
import { IMAGES } from '@/utils/images';
import { useWorkoutDetailStore } from '@/store/workoutdetail';

// Sortable item component
const SortableItem: React.FC<{ id: string; item: ExerciseElement }> = ({ id, item }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // backgroundColor: '#f0f0f0',
    // border: '1px solid #ccc',
    // marginBottom: '0.5rem',
    borderRadius: '5px',
    // cursor: 'grab',
  };

  const handleSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div ref={setNodeRef} style={style} id={id}>
      <ExerciseCard data={item} handleSubmit={handleSubmit}>
        <div
          style={{ cursor: 'grab' }}
          {...attributes} // Attaching drag attributes to the name div
          {...listeners} // Attaching drag listeners to the name div
        >
          <em>
            <Image source={IMAGES.dragDot} contentFit="contain" style={tailwind(' h-5 w-5 ')} />
          </em>
        </div>
      </ExerciseCard>
    </div>
  );
};

const DraggableExercises = (props: {}) => {
  // const { exercisesData } = props;
  const exercisesList = useWorkoutDetailStore(state => state.workoutDetail)?.exercises ?? [];
  const [items, setItems] = useState<ExerciseElement[]>(exercisesList);

  // Sensors to detect dragging (e.g., mouse or touch)
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active?.id !== over?.id) {
      setItems(items => {
        const oldIndex = items.findIndex(item => item?._id === active?.id);
        const newIndex = items.findIndex(item => item?._id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="space-y-1 overflow-x-hidden overflow-y-scroll">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(item => item._id)} strategy={verticalListSortingStrategy}>
          {items.map((item: ExerciseElement) => (
            <SortableItem key={item?._id} id={item?._id} item={item} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default DraggableExercises;
