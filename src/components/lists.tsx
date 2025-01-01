import React from "react";
import { useSetAtom } from "jotai/react";
import { listsEditorOpenAtom } from "@/lib/store";
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
      color={isSelected ? undefined : "gray"}
      variant={isSelected ? "surface" : "soft"}
      onClick={() => setSelectedList(value)}
    >
      <Flex align="center" gap="2">
        <Text>{name}</Text>
        <Text className="font-mono text-accentA-12">{count}</Text>
        <UserBubbleGroup users={users} numAvatars={3} />
      </Flex>
    </Button>
  );
};

const Lists: React.FC = () => {
  const listsQuery = useQuery(listsQueryOptions);
  const inboxCount = useQuery(todosQueryOptions(null))?.data?.length;
  const allCount = useQuery(todosQueryOptions("all"))?.data?.length;

  const setEditorIsOpen = useSetAtom(listsEditorOpenAtom);

  return (
    <Flex px="3" gap="2" wrap="wrap">
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
      <Button
        size="1"
        variant="surface"
        onClick={() => setEditorIsOpen(true)}
        color="gray"
      >
        <Pencil className="size-3" />
        <span>Edit</span>
      </Button>
    </Flex>
  );
};

export default Lists;
