import { qList } from "@/app/lib/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import React from "react";
import { useDocumentTitle } from "usehooks-ts";
import ListHeader from "../components/list/list-header";
import { z } from "astro/zod";
import PendingListScreen from "../components/screens/pending-list";

export const Route = createFileRoute("/todos/$listId")({
  component: RouteComponent,
  validateSearch: z.object({ highlightedTodoId: z.string().optional() }),
  loader: async ({ context: { queryClient }, params: { listId } }) => {
    const list = await queryClient.ensureQueryData(qList(listId));
    if (!list) throw notFound();
    return { list };
  },
});

function RouteComponent() {
  const { listId } = Route.useParams();
  const { list: loaderList } = Route.useLoaderData();
  const { data: queryList } = useSuspenseQuery(qList(listId));

  const list = queryList ?? loaderList;

  useDocumentTitle(list.name ?? "Todos");

  if (list.isPending) return <PendingListScreen />;

  return (
    <React.Fragment>
      <ListHeader list={list} />
      <Outlet />
    </React.Fragment>
  );
}
