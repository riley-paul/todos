import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Card } from "./ui/card";
import { Check, Loader2 } from "lucide-react";
import type { Todo } from "@/api/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DeleteButton from "./ui/delete-button";
import api from "@/lib/api";
import { getTodosQP } from "@/lib/queries";

interface Props {
  todo: Todo;
}

const TodoItem: React.FC<Props> = (props) => {
  const { todo } = props;
  const queryClient = useQueryClient();

  const completeMutation = useMutation({
    mutationFn: (complete: boolean) =>
      api.todos["toggle-complete"].$post({
        json: { id: todo.id, complete },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getTodosQP.queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.todos.delete.$post({ json: { id: todo.id } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getTodosQP.queryKey });
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
        variant={todo.isCompleted ? "secondary" : "ghost"}
        size="icon"
        disabled={completeMutation.isPending}
        onClick={() => completeMutation.mutate(!todo.isCompleted)}
      >
        {completeMutation.isPending ? (
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
        {todo.text}
      </span>
      <DeleteButton handleDelete={() => deleteMutation.mutate()} />
    </Card>
  );
};

export default TodoItem;
