import Lists from "@/components/lists";
import RefreshButton from "@/components/refresh-button";
import TodoAdder from "@/components/todo-adder";
import { IconButton } from "@radix-ui/themes";
import {
  createFileRoute,
  Link,
  Outlet,
  useParams,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_withAdder")({
  component: RouteComponent,
});

function RouteComponent() {
  const { listId } = useParams({ strict: false });
  return (
    <>
      <main className="grid gap-4">
        <TodoAdder listId={listId ?? null} />
        <Lists />
        <Outlet />
      </main>
      <div className="fixed bottom-8 right-8 flex items-center gap-3">
        <RefreshButton />
        {listId && (
          <IconButton asChild radius="full" size="3" variant="soft">
            <Link to="/todos/$listId/edit" params={{ listId }}>
              <i className="fas fa-pen" />
            </Link>
          </IconButton>
        )}
      </div>
    </>
  );
}
