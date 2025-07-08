import React from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { qLists, qTodos } from "@/lib/client/queries";
import { Flex, IconButton, Separator } from "@radix-ui/themes";
import { useAtom } from "jotai";
import { alertSystemAtom } from "../alert-system/alert-system.store";
import z from "zod/v4";
import { toast } from "sonner";
import useMutations from "@/hooks/use-mutations";
import { PlusIcon } from "lucide-react";
import List from "./list";

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
