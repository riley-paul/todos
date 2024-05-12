import type React from "react";

import { Button } from "./ui/button";
import TodoItem from "./todo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { getTodosQP } from "@/lib/queries";
import { Skeleton } from "./ui/skeleton";

const TodoList: React.FC = () => {
  const todosQuery = useQuery(getTodosQP);
  const queryClient = useQueryClient();

  const deleteCompletedMutation = useMutation({
    mutationFn: () => api.todos["delete-completed"].$post(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getTodosQP.queryKey });
    },
  });

  if (todosQuery.isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {new Array(3).fill(null).map((_, i) => (
          <Skeleton className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (todosQuery.isSuccess && todosQuery.data?.length === 0) {
    return (
      <div className="flex min-h-20 flex-1 items-center justify-center text-sm">
        <p className="text-muted-foreground">No todos!</p>
      </div>
    );
  }

  if (todosQuery.isError) {
    return (
      <div className="flex min-h-20 flex-1 items-center justify-center text-sm">
        <p className="text-muted-foreground">An error occurred</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-2 overflow-auto">
        {todosQuery.data?.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
      </div>
      {todosQuery.isSuccess &&
        todosQuery.data.filter((i) => i.isCompleted).length > 0 && (
          <footer className="sticky bottom-0 z-40 bg-background py-4 pb-10">
            <Button
              className="w-full"
              variant="secondary"
              size="lg"
              onClick={() => deleteCompletedMutation.mutate()}
              disabled={deleteCompletedMutation.isPending}
            >
              Delete Completed
            </Button>
          </footer>
        )}
    </div>
  );
};

export default TodoList;
