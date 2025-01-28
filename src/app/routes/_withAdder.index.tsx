import Todos from "@/components/todos";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_withAdder/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Todos listId={null} />;
}
