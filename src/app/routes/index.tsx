import Lists from "@/components/lists";
import TodoAdder from "@/components/todo-adder";
import Todos from "@/components/todos";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => (
    <>
      <TodoAdder listId={null} />
      <Lists />
      <Todos listId={null} />
    </>
  ),
});
