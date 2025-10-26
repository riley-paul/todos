import { qList, qLists, qTodos } from "@/lib/client/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import NoListsScreen from "../components/screens/no-lists";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData(qTodos(null)),
      queryClient.ensureQueryData(qList(null)),
    ]),
});

function RouteComponent() {
  const { data: lists } = useSuspenseQuery(qLists);
  if (lists.length >= 1)
    return <Navigate to="/todos/$listId" params={{ listId: lists[0].id }} />;
  return <NoListsScreen />;
}
