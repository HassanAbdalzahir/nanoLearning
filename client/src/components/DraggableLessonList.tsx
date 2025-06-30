"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Lesson } from "@/services/lessonService";
import LessonCard from "./LessonCard";

interface DraggableLessonListProps {
  lessons: Lesson[];
  onEdit: (lesson: Lesson) => void;
  onDelete: (lessonId: string) => void;
  onReorder: (
    lessonOrders: { lessonId: string; order: number }[]
  ) => Promise<void>;
  isDark?: boolean;
}

interface SortableLessonCardProps {
  lesson: Lesson;
  onEdit: (lesson: Lesson) => void;
  onDelete: (lessonId: string) => void;
  isDark?: boolean;
}

function SortableLessonCard({
  lesson,
  onEdit,
  onDelete,
  isDark,
}: SortableLessonCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <LessonCard
        lesson={lesson}
        onEdit={onEdit}
        onDelete={onDelete}
        isDragging={isDragging}
        isDark={isDark}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export default function DraggableLessonList({
  lessons,
  onEdit,
  onDelete,
  onReorder,
  isDark = false,
}: DraggableLessonListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = lessons.findIndex((lesson) => lesson._id === active.id);
      const newIndex = lessons.findIndex((lesson) => lesson._id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        // Create new array with reordered lessons
        const reorderedLessons = arrayMove(lessons, oldIndex, newIndex);

        // Create lesson orders array for the API
        const lessonOrders = reorderedLessons.map((lesson, index) => ({
          lessonId: lesson._id,
          order: index + 1,
        }));

        try {
          await onReorder(lessonOrders);
        } catch (error) {
          console.error("Failed to reorder lessons:", error);
        }
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={lessons.map((lesson) => lesson._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <SortableLessonCard
              key={lesson._id}
              lesson={lesson}
              onEdit={onEdit}
              onDelete={onDelete}
              isDark={isDark}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
