import { createFileRoute } from "@tanstack/react-router";
import Adder from "../components/adder";
import TodoList from "../components/todo-list";
import { z } from "zod";

export const Route = createFileRoute("/_app/")({
  validateSearch: (search) =>
    z.object({ tags: z.array(z.string()).optional() }).parse(search),
  component: () => (
    <article className="flex w-full flex-col gap-4 pt-6">
      <Adder />
      <TodoList />
    </article>
  ),
});
