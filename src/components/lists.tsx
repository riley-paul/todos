import React from "react";
import { Badge } from "./ui/badge";
import { useAtom, useSetAtom } from "jotai/react";
import {
  listsEditorOpenAtom,
  selectedListAtom,
  type SelectedList,
} from "@/lib/store";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { listsQueryOptions, todosQueryOptions } from "@/lib/queries";
import { Button } from "./ui/button";
import type { UserSelect } from "@/lib/types";
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
    <Badge
      className="flex h-6 cursor-pointer select-none gap-1.5"
      variant={isSelected ? "default" : "secondary"}
      onClick={() => setSelectedList(value)}
    >
      <span>{name}</span>
      <span
        className={cn("text-muted-foreground", isSelected && "text-secondary")}
      >
        {count}
      </span>
      <UserBubbleGroup users={users} numAvatars={3} />
    </Badge>
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
