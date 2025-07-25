import React from "react";
import { cn } from "@/lib/client/utils";

import { useSuspenseQuery } from "@tanstack/react-query";
import Todo from "./todo";
import { Button, Text } from "@radix-ui/themes";
import type { SelectedList } from "@/lib/types";
import { qTodos, qUser } from "@/lib/client/queries";
import { ChevronRightIcon } from "lucide-react";
import DeleteCompletedTodosButton from "./footer-buttons/delete-completed-todos-button";
import UncheckAllTodosButton from "./footer-buttons/uncheck-all-todos-button";

const Todos: React.FC<{ listId: SelectedList }> = ({ listId }) => {
  const { data: todos } = useSuspenseQuery(qTodos(listId));
  const { data: user } = useSuspenseQuery(qUser);

  const numCompleted = todos.filter((i) => i.isCompleted).length ?? 0;
  const [showCompleted, setShowCompleted] = React.useState(false);

  if (todos.length === 0) {
    return (
      <div className="mx-auto py-12">
        <Text size="2" color="gray" align="center">
          No todos found
        </Text>
      </div>
    );
  }

  if (user.settingGroupCompleted) {
    return (
      <section className="grid gap-4">
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
                <ChevronRightIcon
                  className={cn(
                    "size-4 transition-transform duration-200",
                    showCompleted && "rotate-90",
                  )}
                />
              </Button>
              <DeleteCompletedTodosButton listId={listId} />
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
      </section>
    );
  }

  return (
    <section className="grid gap-1">
      {todos.map((todo) => (
        <Todo key={todo.id} todo={todo} />
      ))}
      <div className="flex items-center justify-end gap-4 px-3 py-1">
        <UncheckAllTodosButton listId={listId} />
        <DeleteCompletedTodosButton listId={listId} />
      </div>
    </section>
  );
};

export default Todos;
