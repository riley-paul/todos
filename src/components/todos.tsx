import React from "react";
import QueryGuard from "./ui/query-guard";
import { cn } from "@/lib/utils";
import useMutations from "@/hooks/use-mutations";

import { useQuery } from "@tanstack/react-query";
import Todo from "./todo";
import { Button, Text } from "@radix-ui/themes";
import type { SelectedList } from "@/lib/types";
import { todosQueryOptions } from "@/lib/queries";

const Todos: React.FC<{ listId: SelectedList }> = ({ listId }) => {
  const todosQuery = useQuery(todosQueryOptions(listId));

  const numCompleted =
    todosQuery.data?.filter((i) => i.isCompleted).length ?? 0;

  const { deleteCompletedTodos } = useMutations();

  const [showCompleted, setShowCompleted] = React.useState(false);

  return (
    <QueryGuard query={todosQuery} noDataString="No tasks yet">
      {(todos) => (
        <>
          <div className="grid gap-1">
            {todos
              .filter((i) => !i.isCompleted)
              .map((todo) => (
                <Todo key={todo.id} todo={todo} />
              ))}
          </div>
          {numCompleted > 0 && (
            <>
              <div className="flex items-center justify-between gap-rx-2 px-rx-2">
                <Button
                  size="1"
                  className="flex h-6 gap-2 px-3"
                  variant="ghost"
                  onClick={() => setShowCompleted((prev) => !prev)}
                >
                  <span>Completed</span>
                  <Text className="font-mono text-accentA-12">
                    {numCompleted}
                  </Text>
                  <i
                    className={cn(
                      "fa-solid fa-chevron-right transition-transform duration-200",
                      showCompleted && "rotate-90",
                    )}
                  />
                </Button>
                <Button
                  size="1"
                  variant="soft"
                  color="gray"
                  onClick={() => deleteCompletedTodos.mutate({ listId })}
                >
                  <i className="fa-solid fa-eraser" />
                  Clear
                </Button>
              </div>
              {showCompleted && (
                <div className="grid gap-1">
                  {todos
                    .filter((i) => i.isCompleted)
                    .map((todo) => (
                      <Todo key={todo.id} todo={todo} />
                    ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </QueryGuard>
  );
};

export default Todos;
