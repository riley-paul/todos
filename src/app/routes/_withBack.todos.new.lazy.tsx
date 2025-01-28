import { createLazyFileRoute } from "@tanstack/react-router";
import ListAdderForm from "@/components/list-adder-form";

export const Route = createLazyFileRoute("/_withBack/todos/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ListAdderForm />;
}
