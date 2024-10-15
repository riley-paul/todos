import React from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  listSelectSchema,
  todoSelectSchema,
  type TodoSelect,
} from "@/lib/types";
import useMutations from "@/hooks/use-mutations";
import Todo from "./todo";

// const customCollisionDetectionAlgorithm: CollisionDetection = (args) => {
//   if (args.collisionRect.height > 50) return [];
//   const pointerCollisions = pointerWithin(args);
//   if (pointerCollisions.length > 0) return pointerCollisions;
//   return closestCenter(args);
// };

const CustomDndContext: React.FC<React.PropsWithChildren> = ({ children }) => {
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const [draggingTodo, setDraggingTodo] = React.useState<TodoSelect | null>(
    null,
  );

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
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {draggingTodo && <Todo todo={draggingTodo} />}
      </DragOverlay>
    </DndContext>
  );
};

export default CustomDndContext;
