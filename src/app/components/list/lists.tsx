import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { qList, qLists } from "@/lib/client/queries";
import { Flex, IconButton, Separator } from "@radix-ui/themes";
import { useAtom } from "jotai";
import { alertSystemAtom } from "../alert-system/alert-system.store";
import { toast } from "sonner";
import useMutations from "@/app/hooks/use-mutations";
import { PlusIcon } from "lucide-react";
import List, { BaseList } from "./list";
import { zListName } from "@/lib/types";

const Lists: React.FC = () => {
  const [, dispatchAlert] = useAtom(alertSystemAtom);
  const { createList } = useMutations();

  const { data: lists } = useSuspenseQuery(qLists);
  const {
    data: { todoCount: inboxCount },
  } = useSuspenseQuery(qList(null));
  const {
    data: { todoCount: allCount },
  } = useSuspenseQuery(qList("all"));

  const handleCreateList = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "input",
        title: "Create New List",
        message: "Enter a name for your new list",
        value: "",
        placeholder: "List name",
        schema: zListName,
        handleSubmit: (name: string) => {
          createList.mutate({ name });
          dispatchAlert({ type: "close" });
          toast.success("List created successfully");
        },
      },
    });
  };

  return (
    <>
      <div className="flex flex-wrap gap-rx-2">
        <BaseList id={null} name="Inbox" count={inboxCount} />
        {lists.length > 0 && <BaseList id="all" name="All" count={allCount} />}
        <Flex align="center">
          <Separator orientation="vertical" size="1" />
        </Flex>
        {lists.map((list) => (
          <List key={list.id} list={list} />
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
