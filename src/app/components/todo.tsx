import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/app/lib/utils";
import { Card } from "./ui/card";
import DeleteButton from "./ui/delete-button";
import { Check, Loader2 } from "lucide-react";
import useMutations from "../hooks/use-mutations";
import { Link } from "@tanstack/react-router";
import type { TodoSelect } from "@/api/lib/types";
import TodoEditor from "./todo-editor";

interface Props {
  todo: TodoSelect;
}

const TodoItem: React.FC<Props> = (props) => {
  const { todo } = props;
  const { deleteTodo, completeTodo } = useMutations();

  const [editorOpen, setEditorOpen] = React.useState(false);

  return (
    <>
      <TodoEditor todo={todo} isOpen={editorOpen} setIsOpen={setEditorOpen} />
      <Card
        className={cn(
          "flex items-center gap-2 rounded-md p-2 text-sm",
          todo.isCompleted && "bg-card/50",
          deleteTodo.isPending && "opacity-50",
        )}
      >
        <Button
          className="rounded-full"
          variant={todo.isCompleted ? "secondary" : "ghost"}
          size="icon"
          disabled={completeTodo.isPending}
          onClick={() =>
            completeTodo.mutate({ id: todo.id, complete: !todo.isCompleted })
          }
        >
          {completeTodo.isPending ? (
            <Loader2 size="1rem" className="animate-spin" />
          ) : (
            <Check size="1rem" />
          )}
        </Button>
        <button
          onClick={() => setEditorOpen(true)}
          className={cn(
            "flex-1 text-left",
            todo.isCompleted && "text-muted-foreground line-through",
          )}
        >
          {todo.text.split(" ").map((word, index) => {
            const isTag = word.startsWith("#");
            if (isTag) {
              return (
                <Link
                  to="/"
                  key={index}
                  search={{ tag: word.slice(1) }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-primary transition-colors hover:underline">
                    {word}
                  </span>{" "}
                </Link>
              );
            }
            return <span key={index}>{word} </span>;
          })}
        </button>
        <DeleteButton handleDelete={() => deleteTodo.mutate({ id: todo.id })} />
      </Card>
    </>
  );
};

export default TodoItem;
