import Lists from "@/components/lists";
import RefreshButton from "@/components/refresh-button";
import TodoAdder from "@/components/todo-adder";
import { goToListEditor } from "@/lib/links";
import { listsQueryOptions } from "@/lib/queries";
import { IconButton, Tooltip } from "@radix-ui/themes";
import {
  createFileRoute,
  Link,
  Outlet,
  useParams,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_withAdder")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(listsQueryOptions);
  },
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
        {listId && listId !== "all" && (
          <Tooltip side="top" content="Edit List">
            <IconButton asChild variant="soft" size="3" radius="full">
              <Link {...goToListEditor(listId)}>
                <i className="fas fa-pen" />
              </Link>
            </IconButton>
          </Tooltip>
        )}
      </div>
    </>
  );
}
