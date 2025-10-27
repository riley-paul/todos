import Todos from "@/app/components/todo/todos";
import { qList, qTodos } from "@/app/lib/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { useDocumentTitle } from "usehooks-ts";
import ListHeader from "../components/list/list-header";
import TodoAdder from "../components/todo-adder";
import { z } from "astro:schema";
import PendingListScreen from "../components/screens/pending-list";

export const Route = createFileRoute("/todos/$listId")({
  component: RouteComponent,
  validateSearch: z.object({ highlightedTodoId: z.string().optional() }),
  loader: async ({ context: { queryClient }, params: { listId } }) => {
    const [todos, list] = await Promise.all([
      queryClient.ensureQueryData(qTodos(listId)),
      queryClient.ensureQueryData(qList(listId)),
    ]);
    return { todos, list };
  },
});

function RouteComponent() {
  const { listId } = Route.useParams();
  const { data: list } = useSuspenseQuery(qList(listId));

  useDocumentTitle(list.name);

  if (list.isPending) return <PendingListScreen />;

  return (
    <React.Fragment>
      <ListHeader list={list} />
      <TodoAdder listId={listId} />
      <Todos list={list} />
    </React.Fragment>
  );
}
