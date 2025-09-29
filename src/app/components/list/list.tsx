import { goToList } from "@/lib/client/links";
import { cn } from "@/lib/client/utils";
import { Badge, IconButton, Text } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import React from "react";
import ListMenu from "./list-menu";
import UserBubbleGroup from "../ui/user-bubble-group";
import type { ListSelect, SelectedList, UserSelect } from "@/lib/types";
import { EllipsisIcon } from "lucide-react";
import useIsLinkActive from "@/app/hooks/use-is-link-active";

type BaseListProps = React.PropsWithChildren<{
  id: SelectedList;
  name: string;
  isPinned?: boolean;
  count?: number;
  otherUsers?: UserSelect[];
  className?: string;
}>;

export const BaseList: React.FC<BaseListProps> = ({
  id,
  name,
  count = 0,
  otherUsers,
  children,
  className,
}) => {
  const isActive = useIsLinkActive(goToList(id));

  return (
    <Badge
      size="2"
      color={isActive ? undefined : "gray"}
      variant={isActive ? "surface" : "soft"}
      className={cn(
        "flex items-center gap-2 transition-colors",
        isActive ? "hover:bg-accent-5" : "hover:bg-accent-6",
        className,
      )}
    >
      <Link {...goToList(id)} className="flex items-center gap-2">
        <Text truncate className="max-w-[70vw]">
          {name}
        </Text>
        <Text className="font-mono opacity-70">{count}</Text>
        {otherUsers && <UserBubbleGroup users={otherUsers} numAvatars={3} />}
      </Link>
      {children}
    </Badge>
  );
};

export const List: React.FC<{ list: ListSelect }> = ({ list }) => {
  const { id, name, otherUsers, todoCount, isPending } = list;

  return (
    <BaseList
      id={id}
      name={name}
      count={todoCount}
      otherUsers={otherUsers}
      className={cn(isPending && "opacity-50")}
    >
      {!isPending && (
        <ListMenu
          trigger={
            <IconButton size="1" variant="ghost">
              <EllipsisIcon className="size-3 opacity-90" />
            </IconButton>
          }
          list={list}
        />
      )}
    </BaseList>
  );
};

export default List;
