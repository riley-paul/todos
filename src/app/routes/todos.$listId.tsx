import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { useDocumentTitle } from "usehooks-ts";
import ListHeader from "../components/list/list-header";
import { z } from "astro/zod";
import PendingListScreen from "../components/screens/pending-list";
import TodoAdder from "../components/todo-adder";
import Todos from "../components/todo/todos";
import NotFoundScreen from "../components/screens/not-found";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getList } from "../lib/queries";

export const Route = createFileRoute("/todos/$listId")({
  component: RouteComponent,
  validateSearch: z.object({ highlightedTodoId: z.string().optional() }),
});

function RouteComponent() {
  const { listId } = Route.useParams();
  const { data: list } = useSuspenseQuery(getList(listId));

  useDocumentTitle(list?.name ?? "Todos");

  if (!list) return <NotFoundScreen />;
  if (list.isPending) return <PendingListScreen list={list} />;

  return (
    <React.Fragment>
      <ListHeader list={list} />
      <TodoAdder listId={listId} />
      <Todos list={list} />
    </React.Fragment>
  );
}
