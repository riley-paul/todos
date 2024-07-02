import type React from "react";

import { Button } from "./ui/button";
import TodoItem from "./todo";
import { useQuery } from "@tanstack/react-query";
import { todosQueryOptions } from "@/app/lib/queries";
import { Skeleton } from "./ui/skeleton";
import useMutations from "../hooks/use-mutations";
import { Badge } from "./ui/badge";
import { Link } from "@tanstack/react-router";

const TodoList: React.FC = () => {
  const { deleteCompleted } = useMutations();
  const todosQuery = useQuery(todosQueryOptions);

  const { todos = [], hashtags = [] } = todosQuery.data ?? {};

  if (todosQuery.isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {new Array(3).fill(null).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
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
    <div className="flex flex-col gap-4">
      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {hashtags.map((hashtag) => (
            <Link to="/" search={{ tag: hashtag }}>
              <Badge variant="secondary" key={hashtag}>
                {hashtag}
              </Badge>
            </Link>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-2 overflow-auto">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
      {todosQuery.isSuccess &&
        todos.filter((i) => i.isCompleted).length > 0 && (
          <footer className="sticky bottom-0 z-40 bg-background py-4 pb-10">
            <Button
              className="w-full"
              variant="secondary"
              size="lg"
              onClick={() => deleteCompleted.mutate()}
              disabled={deleteCompleted.isPending}
            >
              Delete Completed
            </Button>
          </footer>
        )}
    </div>
  );
};

export default TodoList;
