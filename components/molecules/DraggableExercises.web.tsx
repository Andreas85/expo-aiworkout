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

// Sortable item component
const SortableItem: React.FC<{ id: string; item: ExerciseElement }> = ({ id, item }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  console.log(transform, 'transform', id);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} id={id}>
      {item.exercise.name}
    </div>
  );
};

const DraggableExercises = (props: { exercisesData: ExerciseElement[] }) => {
  const { exercisesData } = props;
  const [items, setItems] = useState<ExerciseElement[]>(exercisesData);

  // Sensors to detect dragging (e.g., mouse or touch)
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    console.log(active, 'active', over, 'over');
    if (active.id !== over.id) {
      setItems(items => {
        const oldIndex = items.findIndex(item => item?._id === active.id);
        const newIndex = items.findIndex(item => item?._id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="overflow-x-hidden overflow-y-scroll">
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
