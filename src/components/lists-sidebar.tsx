import { listsQueryOptions, todosQueryOptions } from "@/lib/queries";
import {
  listsEditorOpenAtom,
  selectedListAtom,
  type SelectedList,
} from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import React from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import type { UserSelect } from "@/lib/types";
import { cn } from "@/lib/utils";
import UserBubbleGroup from "./base/user-bubble-group";

const List: React.FC<{
  value: SelectedList;
  name: string;
  count: number | undefined;
  users?: UserSelect[];
}> = ({ value, count = 0, name, users = [] }) => {
  const [selectedList, setSelectedList] = useAtom(selectedListAtom);
  const isSelected = selectedList === value;
  return (
    <Button
      size="sm"
      className="justify-between gap-2 max-w-48"
      variant={isSelected ? "default" : "ghost"}
      onClick={() => setSelectedList(value)}
    >
      <span className="truncate">{name}</span>
      <div className="flex items-center gap-2">
        <UserBubbleGroup users={users} numAvatars={3} />
        <span
          className={cn(
            "text-muted-foreground",
            isSelected && "text-secondary",
          )}
        >
          {count}
        </span>
      </div>
    </Button>
  );
};

const ListsSidebar: React.FC = () => {
  const listsQuery = useQuery(listsQueryOptions);
  const { data: lists = [] } = listsQuery;
  const inboxCount = useQuery(todosQueryOptions(null))?.data?.length;
  const allCount = useQuery(todosQueryOptions("all"))?.data?.length;

  const setEditorIsOpen = useSetAtom(listsEditorOpenAtom);

  return (
    <div className="grid gap-1 rounded-md bg-card p-2">
      <List value={null} name="Inbox" count={inboxCount} />
      <List value={"all"} name="All" count={allCount} />
      <Separator />
      {lists.map((list) => (
        <List
          key={list.id}
          value={list.id}
          name={list.name}
          count={list.todoCount}
          users={list.otherUsers}
        />
      ))}
      <Button
        size="sm"
        variant="outline"
        onClick={() => setEditorIsOpen(true)}
      >
        <i className="fa-solid fa-pen mr-2" />
        <span>Edit</span>
      </Button>
    </div>
  );
};

export default ListsSidebar;
