import React from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { listsQueryOptions, todosQueryOptions } from "@/lib/queries";
import type { SelectedList, UserSelect } from "@/lib/types";
import UserBubbleGroup from "./ui/user-bubble-group";
import { Button, Flex, Separator, Text } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import { goToList } from "@/lib/links";

const List: React.FC<{
  value: SelectedList;
  name: string;
  count: number | undefined;
  users?: UserSelect[];
}> = ({ value, count = 0, name, users = [] }) => {
  return (
    <Link {...goToList(value)}>
      {({ isActive }) => (
        <Button
          size="1"
          color={isActive ? undefined : "gray"}
          variant={isActive ? "surface" : "soft"}
          className="flex items-center gap-2"
        >
          <Text truncate className="max-w-[70vw]">
            {name}
          </Text>
          <Text className="font-mono text-accentA-12">{count}</Text>
          <UserBubbleGroup users={users} numAvatars={3} />
        </Button>
      )}
    </Link>
  );
};

const Lists: React.FC = () => {
  const { data: lists } = useSuspenseQuery(listsQueryOptions);
  const inboxCount = useQuery(todosQueryOptions(null))?.data?.length;
  const allCount = useQuery(todosQueryOptions("all"))?.data?.length;

  return (
    <>
      <div className="flex flex-wrap gap-rx-2 px-rx-3">
        <List value={null} name="Inbox" count={inboxCount} />
        <List value="all" name="All" count={allCount} />
        <Flex align="center">
          <Separator orientation="vertical" size="1" />
        </Flex>
        {lists.map((list) => (
          <List
            key={list.id}
            value={list.id}
            name={list.name}
            count={list.todoCount}
            users={list.otherUsers}
          />
        ))}
        <Button asChild variant="soft" size="1" color="gray">
          <Link to="/list/new">
            <i className="fa-solid fa-plus text-accent-10" />
            New list
          </Link>
        </Button>
      </div>
    </>
  );
};

export default Lists;
