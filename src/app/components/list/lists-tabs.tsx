import React, { useEffect, useRef } from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { qLists, qTodos, qUser } from "@/lib/client/queries";
import { Tabs, Text } from "@radix-ui/themes";
import { useAtom } from "jotai";
import { alertSystemAtom } from "../alert-system/alert-system.store";
import { toast } from "sonner";
import useMutations from "@/app/hooks/use-mutations";
import { zListName, type TodoSelect } from "@/lib/types";
import { Link, useParams, type LinkOptions } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import useIsLinkActive from "@/app/hooks/use-is-link-active";

const getTodoLength = (todos: TodoSelect[]) =>
  todos.filter(({ isCompleted }) => !isCompleted).length;

const ListTab: React.FC<{
  name: string;
  value: string;
  todoCount: number;
  linkOptions: LinkOptions;
}> = ({ name, value, linkOptions, todoCount }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const isActive = useIsLinkActive(linkOptions);

  useEffect(() => {
    if (isActive) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [isActive]);

  return (
    <Link {...linkOptions}>
      <Tabs.Trigger ref={ref} value={value}>
        <span className="flex items-center gap-1">
          {name}
          {!isActive && (
            <Text size="1" className="font-mono opacity-70">
              {todoCount}
            </Text>
          )}
        </span>
      </Tabs.Trigger>
    </Link>
  );
};

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
          <ListTab
            name="Inbox"
            value="inbox"
            todoCount={inboxCount}
            linkOptions={{ to: "/" }}
          />
          <ListTab
            name="All"
            value="all"
            todoCount={allCount}
            linkOptions={{ to: "/todos/$listId", params: { listId: "all" } }}
          />

          {lists
            .filter(({ isPinned, id }) => {
              if (!settingHideUnpinned) return true;
              if (id === listId) return true;
              return isPinned;
            })
            .map((list) => (
              <ListTab
                key={list.id}
                name={list.name}
                value={list.id}
                todoCount={list.todoCount}
                linkOptions={{
                  to: "/todos/$listId",
                  params: { listId: list.id },
                }}
              />
            ))}
          <Tabs.Trigger value="" onClick={handleCreateList}>
            <PlusIcon className="mr-1 size-3 text-accent-10" />
            New List
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
    </div>
  );
};

export default ListsTabs;
