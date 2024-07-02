import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/app/lib/utils";
import { Card } from "./ui/card";
import DeleteButton from "./ui/delete-button";
import type { Todo } from "astro:db";
import { Check, Loader2 } from "lucide-react";
import useMutations from "../hooks/use-mutations";
import { Link } from "@tanstack/react-router";

interface Props {
  todo: typeof Todo.$inferSelect;
}

const TodoItem: React.FC<Props> = (props) => {
  const { todo } = props;
  const { deleteTodo, completeTodo } = useMutations();

  return (
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
      <span
        className={cn(
          "flex-1",
          todo.isCompleted && "text-muted-foreground line-through",
        )}
      >
        {todo.text.split(" ").map((word, index) => {
          const isTag = word.startsWith("#");
          if (isTag) {
            return (
              <Link to="/" key={index} search={{ tag: word.slice(1) }}>
                <span className="text-primary/70 transition-colors hover:text-primary">
                  {word}
                </span>{" "}
              </Link>
            );
          }
          return <span key={index}>{word} </span>;
        })}
      </span>
      <DeleteButton handleDelete={() => deleteTodo.mutate({ id: todo.id })} />
    </Card>
  );
};

export default TodoItem;
