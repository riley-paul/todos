import { goToList } from "@/lib/client/links";
import { cn } from "@/lib/client/utils";
import { Badge, Text } from "@radix-ui/themes";
import { Link, useLinkProps } from "@tanstack/react-router";
import React from "react";
import ListMenu from "./list-menu";
import UserBubbleGroup from "../ui/user-bubble-group";
import type { ListSelect, SelectedList, UserSelect } from "@/lib/types";
import { useChannel } from "ably/react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { qUser } from "@/lib/client/queries";

type BaseListProps = React.PropsWithChildren<{
  id: SelectedList;
  name: string;
  count?: number;
  otherUsers?: UserSelect[];
}>;

export const BaseList: React.FC<BaseListProps> = ({
  id,
  name,
  count = 0,
  otherUsers,
  children,
}) => {
  const linkProps = useLinkProps(goToList(id)) as any;
  const isActive = linkProps["data-status"] === "active";

  return (
    <Badge
      size="2"
      color={isActive ? undefined : "gray"}
      variant={isActive ? "surface" : "soft"}
      className={cn(
        "flex items-center gap-2 transition-colors",
        isActive ? "hover:bg-accent-5" : "hover:bg-accent-6",
      )}
    >
      <Link {...goToList(id)} className="flex items-center gap-2">
        <Text truncate className="max-w-[70vw]">
          {name}
        </Text>
        <Text className="font-mono text-accentA-12">{count}</Text>
        {otherUsers && <UserBubbleGroup users={otherUsers} numAvatars={3} />}
      </Link>
      {children}
    </Badge>
  );
};

export const List: React.FC<{ list: ListSelect }> = ({ list }) => {
  const { id, name, otherUsers, todoCount, isPending } = list;

  const { data: currentUser } = useSuspenseQuery(qUser);
  const queryClient = useQueryClient();

  useChannel(`list:${id}`, "invalidate", (message) => {
    console.log("Received invalidate event for", name);

    if (message.data.actionTakenBy === currentUser.id) {
      console.log("Ignoring invalidation event from self");
      return;
    }
    console.log("Invalidating...");
    queryClient.invalidateQueries();
  });

  if (isPending) {
    return (
      <div className="opacity-50">
        <BaseList
          id={id}
          name={name}
          count={todoCount}
          otherUsers={otherUsers}
        />
      </div>
    );
  }

  return (
    <BaseList id={id} name={name} count={todoCount} otherUsers={otherUsers}>
      <ListMenu list={list} />
    </BaseList>
  );
};

export default List;
