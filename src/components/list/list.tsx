import { goToList } from "@/lib/client/links";
import { cn } from "@/lib/client/utils";
import { Badge, Text } from "@radix-ui/themes";
import { Link, useLinkProps } from "@tanstack/react-router";
import React from "react";
import ListMenu from "./list-menu";
import UserBubbleGroup from "../ui/user-bubble-group";
import type { ListSelect, SelectedList } from "@/lib/types";

type ListProps =
  | {
      type: "list";
      list: ListSelect;
    }
  | {
      type: "custom";
      id: SelectedList;
      name: string;
      count: number;
    };

const List: React.FC<ListProps> = (props) => {
  const id = props.type === "list" ? props.list.id : props.id;
  const name = props.type === "list" ? props.list.name : props.name;
  const todoCount =
    props.type === "list" ? props.list.todoCount : (props.count ?? 0);

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
        <Text className="font-mono text-accentA-12">{todoCount}</Text>
        {props.type === "list" && (
          <UserBubbleGroup users={props.list.otherUsers} numAvatars={3} />
        )}
      </Link>
      {props.type === "list" && <ListMenu list={props.list} />}
    </Badge>
  );
};

export default List;
