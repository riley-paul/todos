import { createFileRoute } from "@tanstack/react-router";
import Adder from "../components/adder";
import TodoList from "../components/todo-list";
import { z } from "zod";
import HashtagList from "../components/hashtag-list";
import DeleteCompletedButton from "../components/delete-completed-button";

export const Route = createFileRoute("/_app/")({
  validateSearch: (search) =>
    z.object({ tag: z.string().optional() }).parse(search),
  component: () => (
    <article className="flex w-full flex-col gap-4 pb-28 pt-6">
      <Adder />
      <HashtagList />
      <TodoList />
      <DeleteCompletedButton />
    </article>
  ),
});
