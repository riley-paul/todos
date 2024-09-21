import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Card } from "./ui/card";
import DeleteButton from "./ui/delete-button";
import { Check, Link2, Loader2 } from "lucide-react";
import useMutations from "@/hooks/use-mutations";
import type { TodoSelect } from "@/lib/types";
import TodoEditor from "./todo-editor";
import TodoText from "./todo-text";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <Card
      ref={ref}
      className={cn(
        "flex items-center gap-2 rounded-md p-2 pr-4 text-sm",
        todo.isCompleted && "bg-card/50",
        deleteTodo.isPending && "opacity-50",
      )}
    >
      <Button
        className="shrink-0 rounded-full"
        variant={todo.isCompleted ? "secondary" : "ghost"}
        size="icon"
        disabled={updateTodo.isPending}
        onClick={() =>
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
      </Button>
      {editorOpen ? (
        <TodoEditor todo={todo} onSubmit={() => setEditorOpen(false)} />
      ) : (
        <button
          onClick={() => setEditorOpen(true)}
          className={cn(
            "flex-1 text-left",
            todo.isCompleted && "text-muted-foreground line-through",
          )}
        >
          <TodoText text={todo.text} />
        </button>
      )}
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
      <DeleteButton handleDelete={() => deleteTodo.mutate({ id: todo.id })} />
    </Card>
  );
};

export default TodoItem;
