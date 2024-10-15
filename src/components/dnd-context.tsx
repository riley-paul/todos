import React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useSetAtom } from "jotai";
import { draggingTodoAtom } from "@/lib/store";
import { listSelectSchema, todoSelectSchema } from "@/lib/types";
import useMutations from "@/hooks/use-mutations";

const customCollisionDetectionAlgorithm: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) return pointerCollisions;
  return closestCenter(args);
};

const CustomDndContext: React.FC<React.PropsWithChildren> = ({ children }) => {
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const setDraggingTodo = useSetAtom(draggingTodoAtom);

  const { moveTodo } = useMutations();

  const handleDragStart = (event: DragStartEvent) => {
    const dragData = event.active.data.current;

    const parsedTodoSelect = todoSelectSchema.safeParse(dragData);
    if (parsedTodoSelect.success) {
      setDraggingTodo(parsedTodoSelect.data);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const dragData = event.active.data.current;
    const dropData = event.over?.data.current;

    const parsedListSelect = listSelectSchema.safeParse(dropData);
    const parsedTodoSelect = todoSelectSchema.safeParse(dragData);

    if (parsedListSelect.success && parsedTodoSelect.success) {
      moveTodo.mutate({
        id: parsedTodoSelect.data.id,
        data: { listId: parsedListSelect.data.id },
      });
    }

    setDraggingTodo(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetectionAlgorithm}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );
};

export default CustomDndContext;
