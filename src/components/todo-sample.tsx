import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Card } from "./ui/card";
import { Check } from "lucide-react";
import DeleteButton from "./ui/delete-button";
import type { Todo } from "astro:db";

interface Props {
  todo: typeof Todo.$inferSelect;
}

const TodoItemSample: React.FC<Props> = (props) => {
  const { todo } = props;

  return (
    <Card
      className={cn(
        "flex items-center gap-2 rounded-md p-2 text-sm",
        todo.isCompleted && "bg-card/50",
      )}
    >
      <Button variant={todo.isCompleted ? "secondary" : "ghost"} size="icon">
        <Check size="1rem" />
      </Button>
      <span
        className={cn(
          "flex-1",
          todo.isCompleted && "text-muted-foreground line-through",
        )}
      >
        {todo.text}
      </span>
      <DeleteButton handleDelete={() => {}} />
    </Card>
  );
};

export default TodoItemSample;
