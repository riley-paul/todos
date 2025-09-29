import React from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { qLists, qTodos, qUser } from "@/lib/client/queries";
import { Tabs } from "@radix-ui/themes";
import { useAtom } from "jotai";
import { alertSystemAtom } from "../alert-system/alert-system.store";
import { toast } from "sonner";
import useMutations from "@/app/hooks/use-mutations";
import { zListName, type TodoSelect } from "@/lib/types";
import { Link, useNavigate, useParams } from "@tanstack/react-router";

const getTodoLength = (todos: TodoSelect[]) =>
  todos.filter(({ isCompleted }) => !isCompleted).length;

const ListsTabs: React.FC = () => {
  const [, dispatchAlert] = useAtom(alertSystemAtom);
  const { createList } = useMutations();

  const { listId = "inbox" } = useParams({ strict: false });

  const {
    data: { settingHideUnpinned },
  } = useSuspenseQuery(qUser);

  const { data: lists } = useSuspenseQuery(qLists);
  const { data: inboxTodos = [] } = useQuery(qTodos(null));
  const { data: allTodos = [] } = useQuery(qTodos("all"));

  const inboxCount = getTodoLength(inboxTodos);
  const allCount = getTodoLength(allTodos);

  const handleCreateList = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "input",
        title: "Create New List",
        message: "Enter a name for your new list",
        value: "",
        placeholder: "List name",
        schema: zListName,
        handleSubmit: (name: string) => {
          createList.mutate({ name });
          dispatchAlert({ type: "close" });
          toast.success("List created successfully");
        },
      },
    });
  };

  return (
    <div className="w-full overflow-auto">
      <Tabs.Root value={listId}>
        <Tabs.List size="1">
          <Link to="/">
            <Tabs.Trigger value="inbox">Inbox</Tabs.Trigger>
          </Link>
          <Link to="/todos/$listId" params={{ listId: "all" }}>
            <Tabs.Trigger value="all">All</Tabs.Trigger>
          </Link>
          {lists
            .filter(({ isPinned, id }) => {
              if (!settingHideUnpinned) return true;
              if (id === listId) return true;
              return isPinned;
            })
            .map((list) => (
              <Link
                to="/todos/$listId"
                params={{ listId: list.id }}
                key={list.id}
              >
                <Tabs.Trigger value={list.id}>{list.name}</Tabs.Trigger>
              </Link>
            ))}
        </Tabs.List>
      </Tabs.Root>
    </div>
  );
};

export default ListsTabs;
