import { useQuery } from "@tanstack/react-query";
import React from "react";
import { listsQueryOptions } from "@/lib/queries";
import { Separator } from "@/components/ui/separator";
import ListPill from "./list-pill";

const Lists: React.FC = () => {
  const listsQuery = useQuery(listsQueryOptions);
  const lists = listsQuery.data ?? [];

  return (
    <div className="flex flex-wrap items-center gap-1.5 px-3">
      <ListPill link="/">Inbox</ListPill>
      <ListPill link="/all">All</ListPill>
      <Separator orientation="vertical" className="h-6" />
      {lists.map((list) => (
        <ListPill
          key={list.id}
          link={`/list/${list.id}`}
          linkLongPress={`/list/${list.id}/edit`}
        >
          {list.name}
        </ListPill>
      ))}
      <ListPill link="/list/new">
        <i className="fa-solid fa-plus" />
      </ListPill>
    </div>
  );
};

export default Lists;
