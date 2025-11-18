import React from "react";
import { cn } from "@/app/lib/utils";

import { useSuspenseQuery } from "@tanstack/react-query";
import Todo from "./todo";
import { Button, Card, Text } from "@radix-ui/themes";
import type { ListSelect, TodoSelect } from "@/lib/types";
import { qTodos, qUser } from "@/app/lib/queries";
import { ChevronRightIcon } from "lucide-react";
import DeleteCompletedTodosButton from "./footer-buttons/delete-completed-todos-button";
import UncheckAllTodosButton from "./footer-buttons/uncheck-all-todos-button";

import NoTodosScreen from "../screens/no-todos";

const CompletedTodosActions: React.FC<{ listId: string }> = ({ listId }) => (
  <div className="flex items-center justify-end gap-4">
    <UncheckAllTodosButton listId={listId} />
    <DeleteCompletedTodosButton listId={listId} />
  </div>
);

const CompletedTodosGroup: React.FC<{
  completedTodos: TodoSelect[];
  listId: string;
}> = ({ completedTodos, listId }) => {
  const [showCompleted, setShowCompleted] = React.useState(false);

  if (completedTodos.length === 0) return null;

  return (
    <Card className="grid gap-3 px-5">
      <header className="flex items-center justify-between gap-2">
        <Button
          size="1"
          className="flex gap-2"
          variant="ghost"
          color="gray"
          onClick={() => setShowCompleted((v) => !v)}
        >
          <span>Completed</span>
          <Text className="text-accentA-12 font-mono">
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
    </Card>
  );
};

const produceTodo = (todo: TodoSelect) => <Todo key={todo.id} todo={todo} />;

type Props = {
  list: ListSelect;
};

const Todos: React.FC<Props> = ({ list }) => {
  const { data: todos } = useSuspenseQuery(qTodos(list.id));
  const { data: user } = useSuspenseQuery(qUser);

  const completedTodos = todos.filter(({ isCompleted }) => isCompleted);
  const notCompletedTodos = todos.filter(({ isCompleted }) => !isCompleted);

  if (todos.length === 0) {
    return <NoTodosScreen />;
  }

  if (user.settingGroupCompleted) {
    return (
      <React.Fragment>
        <div className="grid gap-1">{notCompletedTodos.map(produceTodo)}</div>
        <CompletedTodosGroup completedTodos={completedTodos} listId={list.id} />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="grid gap-1">{todos.map(produceTodo)}</div>
      <CompletedTodosActions listId={list.id} />
    </React.Fragment>
  );
};

export default Todos;
