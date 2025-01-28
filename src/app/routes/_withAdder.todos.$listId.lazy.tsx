import Todos from "@/components/todos";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_withAdder/todos/$listId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { listId } = Route.useParams();
  return <Todos listId={listId} />;
}
