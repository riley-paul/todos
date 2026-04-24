import useAlerts from "@/app/hooks/use-alerts";
import useIsLinkActive from "@/app/hooks/use-is-link-active";
import { type ListSelect } from "@/lib/types";
import { Badge, IconButton, Kbd, Tooltip } from "@radix-ui/themes";
import { Link, linkOptions } from "@tanstack/react-router";
import { ListPlusIcon } from "lucide-react";
import React from "react";
import ListReorder from "./list-reorder";
import { ACCENT_COLOR } from "@/lib/constants";
import { formatForDisplay, useHotkey } from "@tanstack/react-hotkeys";
import { useSuspenseQuery } from "@apollo/client/react";
import { GetListsForChipsDocument } from "@/app/gql/graphql";

const ListChip: React.FC<{ list: ListSelect }> = ({ list }) => {
  const link = linkOptions({
    to: "/todos/$listId",
    params: { listId: list.id },
  });

  const isActive = useIsLinkActive(link);

  const getColor = () => {
    if (!list.show) return "red";
    if (list.isPending) return "gray";
    return ACCENT_COLOR;
  };

  return (
    <Badge
      color={getColor()}
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

const ListChips: React.FC = () => {
  const { handleCreateList } = useAlerts();
  const { data: { lists = [] } = {} } = useSuspenseQuery(
    GetListsForChipsDocument,
  );

  useHotkey("A", handleCreateList, { ignoreInputs: true });

  if (lists.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {lists
        .filter(({ listUser: { show } }) => show)
        .map((list) => (
          <ListChip key={list.id} list={list} />
        ))}
      <ListReorder lists={lists} />
      <Tooltip
        side="bottom"
        content={
          <span className="flex items-center gap-1">
            Add list
            <Kbd>{formatForDisplay("A")}</Kbd>
          </span>
        }
      >
        <IconButton
          size="1"
          className="size-7"
          variant="soft"
          onClick={handleCreateList}
        >
          <ListPlusIcon className="size-4" />
          <span className="sr-only">Create new list</span>
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default ListChips;
