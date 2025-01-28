import TodosPage from "@/components/todos-page";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/todos/all")({
  component: () => <TodosPage listId={"all"} />,
});
