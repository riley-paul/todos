import React from "react";
import { useQuery } from "@tanstack/react-query";
import { listsQueryOptions, todosQueryOptions } from "@/lib/queries";
import type { SelectedList, UserSelect } from "@/lib/types";
import UserBubbleGroup from "./base/user-bubble-group";
import useSelectedList from "@/hooks/use-selected-list";
import { Button, Flex, Separator, Text } from "@radix-ui/themes";
import { Plus } from "lucide-react";
import ListAdder from "./list-adder";

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

  const [adderOpen, setAdderOpen] = React.useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-rx-2 px-rx-3">
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
          variant="soft"
          color="gray"
          onClick={() => setAdderOpen(true)}
        >
          <Plus className="mr-0.5 size-3" />
          Add
        </Button>
      </div>
      <ListAdder isOpen={adderOpen} setIsOpen={setAdderOpen} />
    </>
  );
};

export default Lists;
