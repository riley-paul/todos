import { createFileRoute } from "@tanstack/react-router";
import Adder from "../components/adder";
import TodoList from "../components/todo-list";

export const Route = createFileRoute("/_app/")({
  component: () => (
    <article className="flex w-full flex-col gap-4 pt-6">
      <Adder />
      <TodoList />
    </article>
  ),
});
