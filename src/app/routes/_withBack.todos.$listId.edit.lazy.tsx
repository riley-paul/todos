import ListEditorForm from "@/components/list-editor-form";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_withBack/todos/$listId/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ListEditorForm />;
}
