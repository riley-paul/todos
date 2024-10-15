import React from "react";
import { cn } from "@/lib/utils";
import useMutations from "@/hooks/use-mutations";
import type { TodoSelect } from "@/lib/types";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { Checkbox } from "./ui/checkbox";
import SingleInputForm from "./single-input-form";
import { useAtomValue } from "jotai/react";
import { selectedListAtom } from "@/lib/store";
import UserBubble from "./base/user-bubble";
import { Badge } from "./ui/badge";
import { useDraggable } from "@dnd-kit/core";

interface Props {
  todo: TodoSelect;
}

const Todo: React.FC<Props> = (props) => {
  const { todo } = props;
  const { deleteTodo, updateTodo } = useMutations();

  const selectedList = useAtomValue(selectedListAtom);

  const { setNodeRef, node, listeners, attributes, isDragging } = useDraggable({
    id: todo.id,
    data: todo,
  });

  const [editorOpen, setEditorOpen] = React.useState(false);

  useOnClickOutside(node, () => setEditorOpen(false));
  useEventListener("keydown", (e) => {
    if (e.key === "Escape") setEditorOpen(false);
  });

  React.useEffect(() => {
    setEditorOpen(false);
  }, [todo]);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-10 items-center gap-2 rounded-md px-3 py-1 text-sm transition-colors ease-out hover:bg-muted/20",
        deleteTodo.isPending && "opacity-50",
        isDragging && "opacity-50",
      )}
    >
      {editorOpen ? (
        <SingleInputForm
          size="sm"
          autoFocus
          initialValue={todo.text}
          handleSubmit={(text) => {
            updateTodo
              .mutateAsync({
                id: todo.id,
                data: { text },
              })
              .then(() => setEditorOpen(false));
          }}
        />
      ) : (
        <>
          <Checkbox
            className="shrink-0 rounded-full"
            disabled={updateTodo.isPending}
            checked={todo.isCompleted}
            onCheckedChange={() =>
              updateTodo.mutate({
                id: todo.id,
                data: { isCompleted: !todo.isCompleted },
              })
            }
          />
          <button
            onClick={() => setEditorOpen(true)}
            className={cn(
              "flex-1 text-left",
              todo.isCompleted && "text-muted-foreground line-through",
            )}
          >
            {todo.text}
          </button>
          {todo.list && todo.list.id !== selectedList && (
            <Badge variant="outline">{todo.list.name}</Badge>
          )}
          {!todo.isAuthor && <UserBubble user={todo.author} />}
          <i
            className="fa-solid fa-grip-vertical"
            {...listeners}
            {...attributes}
          />
        </>
      )}
    </div>
  );
};

export default Todo;
