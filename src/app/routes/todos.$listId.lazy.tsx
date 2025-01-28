import Lists from "@/components/lists";
import TodoAdder from "@/components/todo-adder";
import Todos from "@/components/todos";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/todos/$listId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { listId } = Route.useParams();
  return (
    <>
      <TodoAdder listId={listId} />
      <Lists />
      <Todos listId={listId} />
    </>
  );
}
