import React from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { qLists, qTodos } from "@/lib/client/queries";
import UserBubbleGroup from "../ui/user-bubble-group";
import { Button, Select, Text } from "@radix-ui/themes";
import { useNavigate, useParams } from "@tanstack/react-router";
import { goToList } from "@/lib/client/links";
import { useAtom } from "jotai";
import { alertSystemAtom } from "../alert-system/alert-system.store";
import { toast } from "sonner";
import useMutations from "@/hooks/use-mutations";
import { PlusIcon } from "lucide-react";
import { zListName } from "@/lib/types";

const ListsSelect: React.FC = () => {
  const [, dispatchAlert] = useAtom(alertSystemAtom);
  const { createList } = useMutations();

  const navigate = useNavigate();

  const { data: lists } = useSuspenseQuery(qLists);
  const inboxCount = useQuery(qTodos(null))?.data?.length ?? 0;
  const allCount = useQuery(qTodos("all"))?.data?.length ?? 0;

  const { listId } = useParams({ strict: false });

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
    <div className="flex items-center justify-between gap-2 px-3">
      <Select.Root
        value={listId ?? "__inbox"}
        onValueChange={(value) =>
          navigate(goToList(value === "__inbox" ? null : value))
        }
      >
        <Select.Trigger variant="ghost" />
        <Select.Content position="popper">
          <Select.Item value="__inbox">
            <div className="flex items-center gap-2">
              <span>Inbox</span>
              <Text className="font-mono text-accentA-12">{inboxCount}</Text>
            </div>
          </Select.Item>
          <Select.Item value="all">
            <div className="flex items-center gap-2">
              <span>All</span>
              <Text className="font-mono text-accentA-12">{allCount}</Text>
            </div>
          </Select.Item>
          <Select.Separator />
          {lists.map((list) => (
            <Select.Item key={list.id} value={list.id}>
              <div className="flex w-full items-center gap-2">
                <Text>{list.name}</Text>
                <Text className="font-mono text-accentA-12">
                  {list.todoCount}
                </Text>
                <span className="ml-auto">
                  <UserBubbleGroup users={list.otherUsers} numAvatars={3} />
                </span>
              </div>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      <Button size="1" variant="ghost" onClick={handleCreateList}>
        <PlusIcon className="size-4" />
        <span>Add List</span>
      </Button>
    </div>
  );
};

export default ListsSelect;
