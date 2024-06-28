import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/app/lib/utils";
import { Card } from "./ui/card";
import { FaCheck, FaSpinner } from "react-icons/fa6";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DeleteButton from "./ui/delete-button";
import { api } from "@/app/lib/client";
import { todosQueryOptions } from "@/app/lib/queries";
import type { Todo } from "astro:db";
import useListId from "@/app/hooks/use-list-id";

interface Props {
  todo: typeof Todo.$inferSelect;
}

const TodoItem: React.FC<Props> = (props) => {
  const { todo } = props;
  const listId = useListId();
  const { queryKey } = todosQueryOptions(listId);
  const client = useQueryClient();

  const completeMutation = useMutation({
    mutationFn: (complete: boolean) =>
      api.todos["toggle-complete"].$post({
        json: { id: todo.id, complete },
      }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.todos.delete.$post({ json: { id: todo.id } }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey });
    },
  });

  return (
    <Card
      className={cn(
        "flex items-center gap-2 rounded-md p-2 text-sm",
        todo.isCompleted && "bg-card/50",
        deleteMutation.isPending && "opacity-50",
      )}
    >
      <Button
        className="rounded-full"
        variant={todo.isCompleted ? "secondary" : "ghost"}
        size="icon"
        disabled={completeMutation.isPending}
        onClick={() => completeMutation.mutate(!todo.isCompleted)}
      >
        {completeMutation.isPending ? (
          <FaSpinner className="animate-spin" />
        ) : (
          <FaCheck />
        )}
      </Button>
      <span
        className={cn(
          "flex-1",
          todo.isCompleted && "text-muted-foreground line-through",
        )}
      >
        {todo.text}
      </span>
      <DeleteButton handleDelete={() => deleteMutation.mutate()} />
    </Card>
  );
};

export default TodoItem;
