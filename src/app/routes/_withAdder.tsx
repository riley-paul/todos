import Lists from "@/app/components/list/lists";
import TodoAdder from "@/app/components/todo-adder";
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
    <main className="grid gap-4">
      <TodoAdder listId={listId ?? null} />
      <Lists />
      <Outlet />
    </main>
  );
}
