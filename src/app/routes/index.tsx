import TodosPage from "@/components/todos-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => <TodosPage listId={null} />,
});
