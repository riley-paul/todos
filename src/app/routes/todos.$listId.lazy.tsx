import TodosPage from "@/components/todos-page";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/todos/$listId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { listId } = Route.useParams();
  return <TodosPage listId={listId} />;
}
