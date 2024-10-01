import React from "react";
import { cn } from "@/lib/utils";
import DeleteButton from "./ui/delete-button";
import { Check, Link2, Loader2 } from "lucide-react";
import useMutations from "@/hooks/use-mutations";
import type { TodoSelect } from "@/lib/types";
import TodoEditor from "./todo-editor";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "./ui/checkbox";

interface Props {
  todo: TodoSelect;
}

const TodoItem: React.FC<Props> = (props) => {
  const { todo } = props;
  const { deleteTodo, updateTodo } = useMutations();

  const [editorOpen, setEditorOpen] = React.useState(false);

  const ref = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => {
    if (editorOpen) {
      setEditorOpen(false);
    }
  });

  useEventListener("keydown", (e) => {
    if (e.key === "Escape" && editorOpen) {
      setEditorOpen(false);
    }
  });

  React.useEffect(() => {
    setEditorOpen(false);
  }, [todo]);

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-10 items-center gap-2 rounded-md px-3 text-sm transition-colors ease-out hover:bg-muted/20",
        todo.isCompleted && "opacity-50",
        deleteTodo.isPending && "opacity-50",
      )}
    >
      {editorOpen ? (
        <TodoEditor todo={todo} onSubmit={() => setEditorOpen(false)} />
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
          >
            {updateTodo.isPending ? (
              <Loader2 size="1rem" className="animate-spin" />
            ) : (
              <Check size="1rem" />
            )}
          </Checkbox>
          <button
            onClick={() => setEditorOpen(true)}
            className={cn(
              "flex-1 text-left",
              todo.isCompleted && "text-muted-foreground line-through",
            )}
          >
            {todo.text}
          </button>
          {todo.isShared && (
            <Tooltip>
              <TooltipTrigger>
                <Link2 className="size-4" />
              </TooltipTrigger>
              <TooltipContent side="right">
                Created by {todo.user.name}
              </TooltipContent>
            </Tooltip>
          )}
          <DeleteButton
            handleDelete={() => deleteTodo.mutate({ id: todo.id })}
          />
        </>
      )}
    </div>
  );
};

export default TodoItem;
