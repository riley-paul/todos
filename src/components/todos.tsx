import React from "react";
import QueryGuard from "./base/query-guard";
import { cn } from "@/lib/utils";
import useMutations from "@/hooks/use-mutations";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai/react";
import { selectedListAtom } from "@/lib/store";
import { actions } from "astro:actions";
import { Button } from "./ui/button";
import Todo from "./todo";

const Todos: React.FC = () => {
  const listId = useAtomValue(selectedListAtom);
  const todosQuery = useQuery({
    queryKey: ["todos", listId],
    queryFn: () => actions.getTodos.orThrow({ listId }),
  });

  const numCompleted =
    todosQuery.data?.filter((i) => i.isCompleted).length ?? 0;

  const { deleteCompletedTodos } = useMutations();

  const [showCompleted, setShowCompleted] = React.useState(false);
  const selectedList = useAtomValue(selectedListAtom);

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
            <Collapsible
              open={showCompleted}
              onOpenChange={setShowCompleted}
              className="grid gap-2"
            >
              <div className="flex items-center justify-between gap-2 px-1">
                <CollapsibleTrigger asChild>
                  <Button
                    size="sm"
                    className="flex h-6 gap-2 px-2"
                    variant="ghost"
                  >
                    <span>Completed</span>
                    <span className="opacity-80">{numCompleted}</span>
                    <i
                      className={cn(
                        "fa-solid fa-chevron-down transition-transform duration-200",
                        showCompleted && "-rotate-180",
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
                <Button
                  size="sm"
                  className="h-6 px-2"
                  variant="linkMuted"
                  onClick={() =>
                    deleteCompletedTodos.mutate({ listId: selectedList })
                  }
                >
                  <i className="fa-solid fa-eraser mr-1" />
                  Clear completed
                </Button>
              </div>

              <CollapsibleContent className="grid gap-1">
                {todos
                  .filter((i) => i.isCompleted)
                  .map((todo) => (
                    <Todo key={todo.id} todo={todo} />
                  ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </>
      )}
    </QueryGuard>
  );
};

export default Todos;
