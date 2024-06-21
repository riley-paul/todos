import React from "react";

import { ChevronDown, Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { listsQueryOptions } from "@/lib/queries";
import useListId from "@/app/hooks/use-list-id";
import { useNavigate } from "@tanstack/react-router";

const ListSwitcher: React.FC = () => {
  const listsQuery = useQuery(listsQueryOptions);
  const listId = useListId();
  const navigate = useNavigate();

  const currentList = listsQuery.data?.find((list) => list.id === listId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-auto min-w-24 flex-row justify-between gap-2 px-2 py-1 text-muted-foreground"
          variant="ghost"
        >
          {currentList?.name || "Select List"}
          <ChevronDown size="1rem" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[10rem]">
        <DropdownMenuItem disabled>
          <Plus size="1rem" className="mr-2 text-primary" />
          New List
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {listsQuery.data?.map((list) => (
          <DropdownMenuItem
            key={list.id}
            onClick={() => {
              navigate({ to: "/lists/$listId", params: { listId: list.id } });
            }}
          >
            {list.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ListSwitcher;
