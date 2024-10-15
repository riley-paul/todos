import React from "react";
import { Badge } from "./ui/badge";
import { useAtom } from "jotai/react";
import { selectedListAtom, type SelectedList } from "@/lib/store";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { listsQueryOptions, todosQueryOptions } from "@/lib/queries";
import { Button } from "./ui/button";
import ListsEditor from "./lists-editor";
import type { ListSelect } from "@/lib/types";
import UserBubbleGroup from "./base/user-bubble-group";
import { useDroppable } from "@dnd-kit/core";

const BadgeWrapper = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{
    value: SelectedList;
    count?: number;
    name: string;
    isOver?: boolean;
  }>
>(({ value, count = 0, name, children, isOver }, ref) => {
  const [selectedList, setSelectedList] = useAtom(selectedListAtom);
  const isSelected = selectedList === value;
  return (
    <Badge
      ref={ref}
      className={cn(
        "flex h-6 cursor-pointer select-none gap-1.5",
        isOver && "bg-muted",
      )}
      variant={isSelected ? "default" : "secondary"}
      onClick={() => setSelectedList(value)}
    >
      <span>{name}</span>
      {count > 0 && (
        <span
          className={cn(
            "text-muted-foreground",
            isSelected && "text-secondary",
          )}
        >
          {count}
        </span>
      )}
      {children}
    </Badge>
  );
});

const List: React.FC<{
  list: ListSelect;
}> = ({ list }) => {
  const { setNodeRef, isOver } = useDroppable({ id: list.id, data: list });
  return (
    <BadgeWrapper
      ref={setNodeRef}
      value={list.id}
      count={list.todoCount}
      name={list.name}
      isOver={isOver}
    >
      <UserBubbleGroup users={list.otherUsers} numAvatars={3} />
    </BadgeWrapper>
  );
};

const Lists: React.FC = () => {
  const listsQuery = useQuery(listsQueryOptions);
  const inboxCount = useQuery(todosQueryOptions(null))?.data?.length;
  const allCount = useQuery(todosQueryOptions("all"))?.data?.length;

  const [editorIsOpen, setEditorIsOpen] = React.useState(false);

  return (
    <div className="flex flex-wrap gap-2 px-3">
      <BadgeWrapper value={null} name="Inbox" count={inboxCount} />
      <BadgeWrapper value={"all"} name="All" count={allCount} />
      <div className="flex items-center">
        <Separator orientation="vertical" className="h-5" />
      </div>
      {listsQuery.data?.map((list) => <List key={list.id} list={list} />)}
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-1.5"
        onClick={() => setEditorIsOpen(true)}
      >
        <i className="fa-solid fa-pen mr-1.5" />
        <span>Edit</span>
      </Button>
      <ListsEditor isOpen={editorIsOpen} setIsOpen={setEditorIsOpen} />
    </div>
  );
};

export default Lists;
