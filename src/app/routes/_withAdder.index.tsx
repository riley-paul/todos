import Todos from "@/components/todos";
import { todosQueryOptions } from "@/lib/queries";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_withAdder/")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(todosQueryOptions(null));
  },
});

function RouteComponent() {
  return <Todos listId={null} />;
}
