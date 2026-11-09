import { createFileRoute, notFound } from "@tanstack/react-router";
import React from "react";
import { useDocumentTitle } from "usehooks-ts";
import ListHeader from "../components/list/list-header";
import { z } from "astro/zod";
import PendingListScreen from "../components/screens/pending-list";
import TodoAdder from "../components/todo-adder";
import Todos from "../components/todo/todos";
import { GetListDocument } from "@/app/gql.gen";
import NotFoundScreen from "@/app/components/screens/not-found";
import { useQuery } from "@apollo/client/react";
import LoadingScreen from "../components/screens/loading";

export const Route = createFileRoute("/todos/$listId")({
  component: RouteComponent,
  validateSearch: z.object({ highlightedTodoId: z.string().optional() }),
  loader: ({ context: { apolloClient }, params: { listId } }) => {
    apolloClient.query({ query: GetListDocument, variables: { listId } });
  },
});

function RouteComponent() {
  const { listId } = Route.useParams();
  const { data: { list } = {}, loading } = useQuery(GetListDocument, {
    variables: { listId },
  });

  useDocumentTitle(list?.name ?? "Todos");

  if (loading) return <LoadingScreen />;
  if (!list) return <NotFoundScreen />;
  if (list.isPending) return <PendingListScreen list={list} />;

  return (
    <React.Fragment>
      <ListHeader list={list} />
      <TodoAdder list={list} />
      <Todos list={list} />
    </React.Fragment>
  );
}
