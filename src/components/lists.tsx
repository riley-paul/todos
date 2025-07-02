import React from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { qLists, qTodos } from "@/lib/client/queries";
import type { ListSelect, SelectedList } from "@/lib/types";
import UserBubbleGroup from "./ui/user-bubble-group";
import { Badge, Button, Flex, Separator, Text } from "@radix-ui/themes";
import { Link, useLinkProps } from "@tanstack/react-router";
import { goToList } from "@/lib/client/links";
import ListMenu from "./list-menu";
import { cn } from "@/lib/client/utils";

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

const Lists: React.FC = () => {
  const { data: lists } = useSuspenseQuery(qLists);
  const inboxCount = useQuery(qTodos(null))?.data?.length ?? 0;
  const allCount = useQuery(qTodos("all"))?.data?.length ?? 0;

  return (
    <>
      <div className="flex flex-wrap gap-rx-2 px-rx-3">
        <List type="custom" id={null} name="Inbox" count={inboxCount} />
        {lists.length > 0 && (
          <List type="custom" id="all" name="All" count={allCount} />
        )}
        <Flex align="center">
          <Separator orientation="vertical" size="1" />
        </Flex>
        {lists.map((list) => (
          <List type="list" key={list.id} list={list} />
        ))}
        <Button asChild variant="soft" size="1" color="gray">
          <Link to="/list/new">
            <i className="fa-solid fa-plus text-accent-10" />
            <span className="sr-only">New list</span>
          </Link>
        </Button>
      </div>
    </>
  );
};

export default Lists;
