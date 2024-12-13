import React from "react";
import { useSetAtom } from "jotai/react";
import { listsEditorOpenAtom } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { listsQueryOptions, todosQueryOptions } from "@/lib/queries";
import type { SelectedList, UserSelect } from "@/lib/types";
import UserBubbleGroup from "./base/user-bubble-group";
import useSelectedList from "@/hooks/use-selected-list";
import { Button, Flex, Separator, Text } from "@radix-ui/themes";
import { Pencil } from "lucide-react";

const List: React.FC<{
  value: SelectedList;
  name: string;
  count: number | undefined;
  users?: UserSelect[];
}> = ({ value, count = 0, name, users = [] }) => {
  const { selectedList, setSelectedList } = useSelectedList();
  const isSelected = selectedList === value;
  return (
    <Button
      size="1"
      className="flex h-6 select-none gap-1.5"
      variant={isSelected ? "solid" : "soft"}
      onClick={() => setSelectedList(value)}
    >
      <Text>{name}</Text>
      <Text color="gray">{count}</Text>
      <UserBubbleGroup users={users} numAvatars={3} />
    </Button>
  );
};

const Lists: React.FC = () => {
  const listsQuery = useQuery(listsQueryOptions);
  const inboxCount = useQuery(todosQueryOptions(null))?.data?.length;
  const allCount = useQuery(todosQueryOptions("all"))?.data?.length;

  const setEditorIsOpen = useSetAtom(listsEditorOpenAtom);

  return (
    <Flex px="4" gap="2" wrap="wrap">
      <List value={null} name="Inbox" count={inboxCount} />
      <List value={"all"} name="All" count={allCount} />
      <Flex align="center">
        <Separator orientation="vertical" size="1" />
      </Flex>
      {listsQuery.data?.map((list) => (
        <List
          key={list.id}
          value={list.id}
          name={list.name}
          count={list.todoCount}
          users={list.otherUsers}
        />
      ))}
      <Button size="1" variant="soft" onClick={() => setEditorIsOpen(true)}>
        <Pencil size="0.8rem" />
        <span>Edit</span>
      </Button>
    </Flex>
  );
};

export default Lists;
