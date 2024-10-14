import React from "react";
import { Badge } from "./ui/badge";
import { useAtom } from "jotai/react";
import { selectedListAtom, type SelectedList } from "@/lib/store";
import { Separator } from "./ui/separator";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { listsQueryOptions, todosQueryOptions } from "@/lib/queries";
import { Button } from "./ui/button";
import ListsEditor from "./lists-editor";
import type { ListSelect } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BadgeWrapper: React.FC<{
  value: SelectedList;
  count?: number;
  name: string;
  children?: (isSelected: boolean) => React.ReactNode;
}> = ({ value, count = 0, name, children }) => {
  const [selectedList, setSelectedList] = useAtom(selectedListAtom);
  const isSelected = selectedList === value;
  return (
    <Badge
      className="flex h-6 cursor-pointer select-none gap-1.5"
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
      {children?.(isSelected)}
    </Badge>
  );
};

const NUM_AVATARS = 3;
const List: React.FC<{
  list: ListSelect;
}> = ({ list }) => {
  return (
    <BadgeWrapper value={list.id} count={list.todoCount} name={list.name}>
      {(isSelected) =>
        list.otherUsers.length > 0 && (
          <div className="flex">
            {list.otherUsers.slice(0, NUM_AVATARS).map((user) => (
              <Avatar key={user.id} className="-ml-1 size-4 first:ml-0">
                <AvatarImage src={user.avatarUrl ?? ""} alt={user.name} />
                <AvatarFallback>{user.name[0]} </AvatarFallback>
              </Avatar>
            ))}
            {list.otherUsers.length > NUM_AVATARS && (
              <div
                className={cn(
                  "z-10 -ml-1 flex h-4 items-center rounded-full bg-muted px-1 text-muted-foreground transition-colors",
                  isSelected && "bg-teal-400 text-secondary",
                )}
              >
                <span>+{list.shares.length - NUM_AVATARS}</span>
              </div>
            )}
          </div>
        )
      }
    </BadgeWrapper>
  );
};

const Lists: React.FC = () => {
  const listsQuery = useQuery(listsQueryOptions);
  const inboxCount = useQuery(todosQueryOptions({ listId: null }))?.data
    ?.length;
  const allCount = useQuery(todosQueryOptions({ listId: "all" }))?.data?.length;

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
        variant="outline"
        className="h-6 cursor-pointer select-none px-1.5 font-normal"
        onClick={() => setEditorIsOpen(true)}
      >
        <Pencil className="size-3" />
      </Button>
      <ListsEditor isOpen={editorIsOpen} setIsOpen={setEditorIsOpen} />
    </div>
  );
};

export default Lists;
