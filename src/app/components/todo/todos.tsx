import React from "react";
import { cn } from "@/lib/client/utils";

import { useSuspenseQuery } from "@tanstack/react-query";
import Todo from "./todo";
import { Button, Card, Text } from "@radix-ui/themes";
import type { SelectedList, TodoSelect } from "@/lib/types";
import { qList, qTodos, qUser } from "@/lib/client/queries";
import { ChevronRightIcon } from "lucide-react";
import DeleteCompletedTodosButton from "./footer-buttons/delete-completed-todos-button";
import UncheckAllTodosButton from "./footer-buttons/uncheck-all-todos-button";

import emptyTodoImg from "@/assets/undraw_no-data_ig65.svg";

const CompletedTodosActions: React.FC<{ listId: SelectedList }> = ({
  listId,
}) => (
  <div className="flex items-center justify-end gap-4 px-3 py-1">
    <UncheckAllTodosButton listId={listId} />
    <DeleteCompletedTodosButton listId={listId} />
  </div>
);

const CompletedTodosGroup: React.FC<{
  completedTodos: TodoSelect[];
  listId: SelectedList;
}> = ({ completedTodos, listId }) => {
  const [showCompleted, setShowCompleted] = React.useState(false);

  if (completedTodos.length === 0) return null;

  return (
    <section className="grid gap-3">
      <header className="flex items-center justify-between gap-2 px-2">
        <Button
          size="1"
          className="flex h-5 gap-2 px-3 py-1"
          variant="ghost"
          onClick={() => setShowCompleted((v) => !v)}
        >
          <span>Completed</span>
          <Text className="font-mono text-accentA-12">
            {completedTodos.length}
          </Text>
          <ChevronRightIcon
            className={cn(
              "size-4 transition-transform duration-200",
              showCompleted && "rotate-90",
            )}
          />
        </Button>
        <CompletedTodosActions listId={listId} />
      </header>
      {showCompleted && (
        <div className="grid gap-1">{completedTodos.map(produceTodo)}</div>
      )}
    </section>
  );
};

const produceTodo = (todo: TodoSelect) => <Todo key={todo.id} todo={todo} />;

const Todos: React.FC<{ listId: SelectedList }> = ({ listId }) => {
  const { data: todos } = useSuspenseQuery(qTodos(listId));
  const { data: user } = useSuspenseQuery(qUser);

  const completedTodos = todos.filter(({ isCompleted }) => isCompleted);
  const notCompletedTodos = todos.filter(({ isCompleted }) => !isCompleted);

  if (todos.length === 0) {
    return (
      <Card className="flex w-full flex-col items-center justify-center gap-8 py-12">
        <Text size="2" color="gray" align="center">
          No todos found
        </Text>
        <img src={emptyTodoImg.src} className="w-[150px]" />
      </Card>
    );
  }

  if (user.settingGroupCompleted) {
    return (
      <>
        <Card className="grid gap-1">{notCompletedTodos.map(produceTodo)}</Card>
        <CompletedTodosGroup completedTodos={completedTodos} listId={listId} />
      </>
    );
  }

  return (
    <Card className="grid gap-4">
      <div className="grid gap-1">{todos.map(produceTodo)}</div>
      <CompletedTodosActions listId={listId} />
    </Card>
  );
};

export default Todos;
