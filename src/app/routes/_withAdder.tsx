import Lists from "@/components/list/lists";
import RefreshButton from "@/components/refresh-button";
import TodoAdder from "@/components/todo-adder";
import { qLists } from "@/lib/client/queries";
import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/_withAdder")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(qLists);
  },
  validateSearch: z
    .object({ highlightedTodoId: z.string().optional() })
    .optional(),
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
      </div>
    </>
  );
}
