import { createFileRoute, useSearch } from "@tanstack/react-router";
import Adder from "../components/adder";
import TodoList from "../components/todo-list";
import { z } from "zod";
import HashtagList from "../components/hashtag-list";
import { useDocumentTitle } from "usehooks-ts";

const Component: React.FC = () => {
  const { tag } = useSearch({ from: "/_app/" });
  useDocumentTitle(`Todos${tag && tag !== "~" ? ` - ${tag}` : ""}`, {
    preserveTitleOnUnmount: false,
  });

  return (
    <article className="flex w-full flex-col gap-4 pb-28 pt-6">
      <Adder />
      <HashtagList />
      <TodoList />
    </article>
  );
};

export const Route = createFileRoute("/_app/")({
  validateSearch: (search) =>
    z.object({ tag: z.string().optional() }).parse(search),
  component: Component,
});
