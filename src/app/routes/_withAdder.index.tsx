import Todos from "@/app/components/todo/todos";
import { qList, qTodos } from "@/lib/client/queries";
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
  return <Todos listId={null} />;
}
