import Todos from "@/app/components/todo/todos";
import { qList, qTodos } from "@/lib/client/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useDocumentTitle } from "usehooks-ts";

export const Route = createFileRoute("/_withAdder/")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData(qTodos(null)),
      queryClient.ensureQueryData(qList(null)),
    ]),
});

function RouteComponent() {
  useDocumentTitle("Inbox");
  const { data: list } = useSuspenseQuery(qList(null));
  return <Todos listId={null} list={list} />;
}
