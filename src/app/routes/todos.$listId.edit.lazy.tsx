import ListEditorForm from "@/components/list-editor-form";
import { Button } from "@radix-ui/themes";
import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/todos/$listId/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { listId } = Route.useParams();
  return (
    <main className="container2 grid gap-3">
      <div>
        <Button asChild size="2" variant="ghost" className="gap-2">
          <Link to="/todos/$listId" params={{ listId }}>
            <i className="fas fa-arrow-left" />
            Back
          </Link>
        </Button>
      </div>
      <ListEditorForm />
    </main>
  );
}
