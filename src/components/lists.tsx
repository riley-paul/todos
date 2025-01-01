import React from "react";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { listsQueryOptions, todosQueryOptions } from "@/lib/queries";
import { Button } from "./ui/button";
import type { SelectedList, UserSelect } from "@/lib/types";
import UserBubbleGroup from "./base/user-bubble-group";
import useSelectedList from "@/hooks/use-selected-list";
import ListModal from "./list-modal/list-modal";

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

const ListButton: React.FC<
  React.PropsWithChildren<{ onClick: () => void }>
> = ({ onClick, children }) => {
  return (
    <Button
      size="sm"
      className="flex h-6 select-none gap-1.5"
      variant="outline"
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

const Lists: React.FC = () => {
  const listsQuery = useQuery(listsQueryOptions);
  const inboxCount = useQuery(todosQueryOptions(null))?.data?.length;
  const allCount = useQuery(todosQueryOptions("all"))?.data?.length;

  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <>
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
        <ListButton onClick={() => setModalOpen(true)}>
          <i className="fa-solid fa-pen text-muted-foreground" />
          <span>Edit</span>
        </ListButton>
        <ListButton onClick={() => setModalOpen(true)}>
          <i className="fa-solid fa-plus text-muted-foreground" />
          <span>Add</span>
        </ListButton>
      </div>
      <ListModal open={modalOpen} setOpen={setModalOpen} list={undefined} />
    </>
  );
};

export default Lists;
