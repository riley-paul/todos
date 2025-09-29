import React from "react";
import { cn } from "@/lib/client/utils";

import { useSuspenseQuery } from "@tanstack/react-query";
import Todo from "./todo";
import {
  Badge,
  Button,
  Card,
  Heading,
  IconButton,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import type { ListSelect, SelectedList, TodoSelect } from "@/lib/types";
import { qTodos, qUser } from "@/lib/client/queries";
import { ChevronRightIcon, MoreHorizontalIcon, PinIcon } from "lucide-react";
import DeleteCompletedTodosButton from "./footer-buttons/delete-completed-todos-button";
import UncheckAllTodosButton from "./footer-buttons/uncheck-all-todos-button";

import emptyTodoImg from "@/assets/undraw_no-data_ig65.svg";
import Illustration from "../illustration";
import ListMenu from "../list/list-menu";
import UserBubbleGroup from "../ui/user-bubble-group";
import useMutations from "@/app/hooks/use-mutations";

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
    <Card className="grid gap-3">
      <header className="flex items-center justify-between gap-2">
        <Button
          size="1"
          className="flex gap-2"
          variant="ghost"
          color="gray"
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
    </Card>
  );
};

const TodosContainer: React.FC<
  React.PropsWithChildren<{ list: ListSelect }>
> = ({ children, list }) => {
  const { updateList } = useMutations();

  const handleTogglePin = () => {
    updateList.mutate({ id: list.id, data: { isPinned: !list.isPinned } });
  };

  return (
    <Card size="2" className="grid gap-4">
      <header className="flex items-center justify-between gap-4">
        <Heading as="h2" size="4">
          {list.name}
        </Heading>
        <section className="flex items-center gap-2">
          {list.otherUsers && (
            <UserBubbleGroup users={list.otherUsers} numAvatars={3} />
          )}

          <Badge color="gray">{list.todoCount}</Badge>

          <Tooltip content={list.isPinned ? "Unpin List" : "Pin List"}>
            <IconButton variant="ghost" color="gray" onClick={handleTogglePin}>
              <PinIcon
                className={cn("size-4", list.isPinned && "text-amber-9")}
              />
            </IconButton>
          </Tooltip>

          <ListMenu
            list={list}
            trigger={
              <IconButton size="2" variant="soft" className="!m-0">
                <MoreHorizontalIcon className="size-4" />
              </IconButton>
            }
          />
        </section>
      </header>
      {children}
    </Card>
  );
};

const produceTodo = (todo: TodoSelect) => <Todo key={todo.id} todo={todo} />;

type Props = {
  listId: SelectedList;
  list: ListSelect;
};

const Todos: React.FC<Props> = ({ listId, list }) => {
  const { data: todos } = useSuspenseQuery(qTodos(listId));
  const { data: user } = useSuspenseQuery(qUser);

  const completedTodos = todos.filter(({ isCompleted }) => isCompleted);
  const notCompletedTodos = todos.filter(({ isCompleted }) => !isCompleted);

  if (todos.length === 0) {
    return (
      <TodosContainer list={list}>
        <div className="flex w-full flex-col items-center justify-center gap-6 py-12">
          <Illustration src={emptyTodoImg.src} />
          <Text size="2" color="gray" align="center">
            No todos found
          </Text>
        </div>
      </TodosContainer>
    );
  }

  if (user.settingGroupCompleted) {
    return (
      <>
        <TodosContainer list={list}>
          <div className="grid gap-1">{notCompletedTodos.map(produceTodo)}</div>
        </TodosContainer>
        <CompletedTodosGroup completedTodos={completedTodos} listId={listId} />
      </>
    );
  }

  return (
    <TodosContainer list={list}>
      <div className="grid gap-1">{todos.map(produceTodo)}</div>
      <CompletedTodosActions listId={listId} />
    </TodosContainer>
  );
};

export default Todos;
