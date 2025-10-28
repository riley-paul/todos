import Todos from "@/app/components/todo/todos";
import { qList, qTodos } from "@/app/lib/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate, notFound } from "@tanstack/react-router";
import React from "react";
import { z } from "astro/zod";

export const Route = createFileRoute("/todos/$listId/share")({
  component: RouteComponent,
  validateSearch: z.object({ highlightedTodoId: z.string().optional() }),
  loader: async ({ context: { queryClient }, params: { listId } }) => {
    const [todos, list] = await Promise.all([
      queryClient.ensureQueryData(qTodos(listId)),
      queryClient.ensureQueryData(qList(listId)),
    ]);
    if (!list) throw notFound();
    return { todos, list };
  },
});

function RouteComponent() {
  const { listId } = Route.useParams();
  const { data: list } = useSuspenseQuery(qList(listId));

  if (!list) return <Navigate to="/" />;

  return <React.Fragment>list sharing</React.Fragment>;
}
