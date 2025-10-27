import useAlerts from "@/app/hooks/use-alerts";
import useIsLinkActive from "@/app/hooks/use-is-link-active";
import { type ListSelect } from "@/lib/types";
import { Badge, IconButton } from "@radix-ui/themes";
import { Link, linkOptions } from "@tanstack/react-router";
import { ListPlusIcon } from "lucide-react";
import React from "react";
// import ListReorder from "./list-reorder";

const ListChip: React.FC<{ list: ListSelect }> = ({ list }) => {
  const link = linkOptions({
    to: "/todos/$listId",
    params: { listId: list.id },
  });

  const isActive = useIsLinkActive(link);
  return (
    <Badge
      color={list.isPending ? "gray" : undefined}
      variant={isActive ? "solid" : "soft"}
      size="3"
      asChild
    >
      <Link {...link}>
        <span>{list.name}</span>
        <span className="font-mono opacity-70">{list.todoCount}</span>
      </Link>
    </Badge>
  );
};

const ListChips: React.FC<{ lists: ListSelect[] }> = ({ lists }) => {
  const { handleCreateList } = useAlerts();

  if (lists.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {lists.map((list) => (
        <ListChip key={list.id} list={list} />
      ))}
      {/*<ListReorder lists={lists} />*/}
      <IconButton
        size="1"
        className="size-7"
        variant="soft"
        onClick={handleCreateList}
      >
        <ListPlusIcon className="size-4" />
        <span className="sr-only">Create new list</span>
      </IconButton>
    </div>
  );
};

export default ListChips;
