import React from "react";
import { useSetAtom } from "jotai/react";
import { listsEditorOpenAtom } from "@/lib/store";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { listsQueryOptions, todosQueryOptions } from "@/lib/queries";
import { Button } from "./ui/button";
import type { SelectedList, UserSelect } from "@/lib/types";
import UserBubbleGroup from "./base/user-bubble-group";
import useSelectedList from "@/hooks/use-selected-list";

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
      size="sm"
      className="flex h-6 select-none gap-1.5"
      variant={isSelected ? "default" : "secondary"}
      onClick={() => setSelectedList(value)}
    >
      <span>{name}</span>
      <span
        className={cn(
          "font-mono text-muted-foreground",
          isSelected && "text-secondary",
        )}
      >
        {count}
      </span>
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
    <div className="flex flex-wrap gap-2 px-3">
      <List value={null} name="Inbox" count={inboxCount} />
      <List value={"all"} name="All" count={allCount} />
      <div className="flex items-center">
        <Separator orientation="vertical" className="h-5" />
      </div>
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
        variant="ghostMuted"
        size="sm"
        className="h-6 px-3"
        onClick={() => setEditorIsOpen(true)}
      >
        <i className="fa-solid fa-pen mr-1.5" />
        <span>Edit</span>
      </Button>
    </div>
  );
};

export default Lists;
