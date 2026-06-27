import { createFileRoute, notFound } from "@tanstack/react-router";
import React from "react";
import { useDocumentTitle } from "usehooks-ts";
import ListHeader from "../components/list/list-header";
import { z } from "astro/zod";
import PendingListScreen from "../components/screens/pending-list";
import TodoAdder from "../components/todo-adder";
import Todos from "../components/todo/todos";
<<<<<<< HEAD
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
=======
import NotFoundScreen from "../components/screens/not-found";
import { useSuspenseQuery } from "@tanstack/react-query";
import { qList, qTodos } from "../lib/queries";
>>>>>>> origin/main

export const Route = createFileRoute("/todos/$listId")({
  component: RouteComponent,
  validateSearch: z.object({ highlightedTodoId: z.string().optional() }),
<<<<<<< HEAD
<<<<<<< HEAD
  loader: async ({ context: { apolloClient }, params: { listId } }) => {
    const {
      data: { list },
    } = await apolloClient.query<GetListQuery, GetListQueryVariables>({
      query: GetListDocument,
      variables: { listId },
    });
=======
=======
>>>>>>> origin/main
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
<<<<<<< HEAD
  const { list: loaderList } = Route.useLoaderData();
  const {
    data: { list: queryList },
  } = useGetListSuspenseQuery({ variables: { listId } });
=======
  const { data: list } = useSuspenseQuery(qList(listId));
>>>>>>> main
=======
  const { data: list } = useSuspenseQuery(qList(listId));
>>>>>>> origin/main

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
