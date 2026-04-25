import { createFileRoute, notFound } from "@tanstack/react-router";
import React from "react";
import { useDocumentTitle } from "usehooks-ts";
import ListHeader from "../components/list/list-header";
import { z } from "astro/zod";
import PendingListScreen from "../components/screens/pending-list";
import TodoAdder from "../components/todo-adder";
import Todos from "../components/todo/todos";
import {
  GetListDocument,
  useGetListSuspenseQuery,
  type GetListQuery,
  type GetListQueryVariables,
} from "@/app/gql.gen";

export const Route = createFileRoute("/todos/$listId")({
  component: RouteComponent,
  validateSearch: z.object({ highlightedTodoId: z.string().optional() }),
  loader: async ({ context: { apolloClient }, params: { listId } }) => {
    const {
      data: { list },
    } = await apolloClient.query<GetListQuery, GetListQueryVariables>({
      query: GetListDocument,
      variables: { listId },
    });
    if (!list) throw notFound();
    return { list };
  },
});

function RouteComponent() {
  const { listId } = Route.useParams();
  const { list: loaderList } = Route.useLoaderData();
  const {
    data: { list: queryList },
  } = useGetListSuspenseQuery({ variables: { listId } });

  const list = queryList ?? loaderList;

  useDocumentTitle(list.name ?? "Todos");

  if (list.isPending) return <PendingListScreen />;

  return (
    <React.Fragment>
      <ListHeader list={list} />
      <TodoAdder list={list} />
      <Todos list={list} />
    </React.Fragment>
  );
}
