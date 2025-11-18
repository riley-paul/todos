import { createFileRoute, Navigate, notFound } from "@tanstack/react-router";
import React from "react";
import { useDocumentTitle } from "usehooks-ts";
// import ListHeader from "../components/list/list-header";
import { z } from "astro/zod";
import PendingListScreen from "../components/screens/pending-list";
import TodoAdder from "../components/todo-adder";
import Todos from "../components/todo/todos";
import { listCollection } from "../lib/collections";

export const Route = createFileRoute("/todos/$listId")({
  component: RouteComponent,
  validateSearch: z.object({ highlightedTodoId: z.string().optional() }),
  loader: async ({ params: { listId } }) => {
    const state = await listCollection.stateWhenReady();
    const list = state.get(listId);
    if (!list) throw notFound();
    return { list };
  },
});

function RouteComponent() {
  const { currentUser } = Route.useRouteContext();
  const { listId } = Route.useParams();
  const { list } = Route.useLoaderData();

  useDocumentTitle(list.name);

  if (!list) return <Navigate to="/" replace />;
  // if (list.isPending) return <PendingListScreen />;

  return (
    <React.Fragment>
      {/*<ListHeader list={list} />*/}
      <TodoAdder listId={listId} userId={currentUser.id} />
      <Todos list={list} />
    </React.Fragment>
  );
}
