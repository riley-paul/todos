import { createFileRoute, notFound } from "@tanstack/react-router";
import React from "react";
import { useDocumentTitle } from "usehooks-ts";
import ListHeader from "../components/list/list-header";
import { z } from "astro/zod";
import PendingListScreen from "../components/screens/pending-list";
import TodoAdder from "../components/todo-adder";
import Todos from "../components/todo/todos";
<<<<<<< HEAD
import {
  GetListDocument,
  useGetListSuspenseQuery,
  type GetListQuery,
  type GetListQueryVariables,
} from "@/app/gql.gen";
=======
import NotFoundScreen from "../components/screens/not-found";
import { useSuspenseQuery } from "@tanstack/react-query";
import { qList, qTodos } from "../lib/queries";
>>>>>>> main

export const Route = createFileRoute("/todos/$listId")({
  component: RouteComponent,
  validateSearch: z.object({ highlightedTodoId: z.string().optional() }),
<<<<<<< HEAD
  loader: async ({ context: { apolloClient }, params: { listId } }) => {
    const {
      data: { list },
    } = await apolloClient.query<GetListQuery, GetListQueryVariables>({
      query: GetListDocument,
      variables: { listId },
    });
=======
  loader: async ({ params: { listId }, context: { queryClient } }) => {
    const list = await queryClient.ensureQueryData(qList(listId));
>>>>>>> main
    if (!list) throw notFound();
    await queryClient.ensureQueryData(qTodos(listId));
  },
});

function RouteComponent() {
  const { listId } = Route.useParams();
<<<<<<< HEAD
  const { list: loaderList } = Route.useLoaderData();
  const {
    data: { list: queryList },
  } = useGetListSuspenseQuery({ variables: { listId } });
=======
  const { data: list } = useSuspenseQuery(qList(listId));
>>>>>>> main

  useDocumentTitle(list?.name ?? "Todos");

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
