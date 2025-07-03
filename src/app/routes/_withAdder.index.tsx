import Todos from "@/components/todo/todos";
import { qTodos } from "@/lib/client/queries";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_withAdder/")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(qTodos(null));
  },
});

function RouteComponent() {
  return <Todos listId={null} />;
}
