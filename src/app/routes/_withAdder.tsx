import TodoAdder from "@/app/components/todo-adder";
import { qLists, qTodos } from "@/lib/client/queries";
import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";
import z from "zod";
import AppLayout from "../components/app-layout";
import ListsMenu from "../components/list/lists-menu";

export const Route = createFileRoute("/_withAdder")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(qLists);
    queryClient.ensureQueryData(qTodos("all"));
    queryClient.ensureQueryData(qTodos(null));
  },
  validateSearch: z
    .object({ highlightedTodoId: z.string().optional() })
    .optional(),
});

function RouteComponent() {
  const { listId } = useParams({ strict: false });
  return (
    <AppLayout breadcrumb={<ListsMenu />}>
      <main className="grid gap-4">
        <TodoAdder listId={listId ?? null} />
        <Outlet />
      </main>
    </AppLayout>
  );
}
