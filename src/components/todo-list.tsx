import type React from "react";

import Todo from "./todo";
import { Skeleton } from "./ui/skeleton";
import useTodosQuery from "@/hooks/use-current-todos";

const TodoList: React.FC = () => {
  const todosQuery = useTodosQuery();
  const todos = todosQuery.data ?? [];

  if (todosQuery.isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {new Array(3).fill(null).map((_, i) => (
          <Skeleton key={i} className="h-[58px] w-full" />
        ))}
      </div>
    );
  }

  if (todosQuery.isSuccess && todos.length === 0) {
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
    <div className="grid gap-1">
      {todosQuery.data?.map((todo) => <Todo key={todo.id} todo={todo} />)}
    </div>
  );
};

export default TodoList;
