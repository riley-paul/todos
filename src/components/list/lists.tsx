import React from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { qLists, qTodos } from "@/lib/client/queries";
import type { ListSelect, SelectedList } from "@/lib/types";
import UserBubbleGroup from "../ui/user-bubble-group";
import { Badge, Flex, IconButton, Separator, Text } from "@radix-ui/themes";
import { Link, useLinkProps } from "@tanstack/react-router";
import { goToList } from "@/lib/client/links";
import ListMenu from "./list-menu";
import { cn } from "@/lib/client/utils";
import { useAtom } from "jotai";
import { alertSystemAtom } from "../alert-system/alert-system.store";
import z from "zod/v4";
import { toast } from "sonner";
import useMutations from "@/hooks/use-mutations";
import { PlusIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import ListDrawer from "./list-drawer";

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
  const isMobile = useIsMobile();

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
      {props.type === "list" &&
        (isMobile ? (
          <ListDrawer list={props.list} />
        ) : (
          <ListMenu list={props.list} />
        ))}
    </Badge>
  );
};

const Lists: React.FC = () => {
  const [, dispatchAlert] = useAtom(alertSystemAtom);
  const { createList } = useMutations();

  const { data: lists } = useSuspenseQuery(qLists);
  const inboxCount = useQuery(qTodos(null))?.data?.length ?? 0;
  const allCount = useQuery(qTodos("all"))?.data?.length ?? 0;

  const handleCreateList = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "input",
        title: "Create New List",
        message: "Enter a name for your new list",
        value: "",
        placeholder: "List name",
        schema: z.string().min(1).max(100),
        handleSubmit: (name: string) => {
          createList.mutate({ data: { name } });
          dispatchAlert({ type: "close" });
          toast.success("List created successfully");
        },
      },
    });
  };

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
        <IconButton
          onClick={handleCreateList}
          variant="ghost"
          size="1"
          className="m-0 size-[26px] p-0"
        >
          <PlusIcon className="size-5 text-accent-10" />
          <span className="sr-only">New list</span>
        </IconButton>
      </div>
    </>
  );
};

export default Lists;
