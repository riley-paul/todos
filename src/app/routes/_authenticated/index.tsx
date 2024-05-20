import { createFileRoute } from "@tanstack/react-router";

import React from "react";
import Adder from "../../components/adder";
import TodoList from "../../components/todo-list";

const Index: React.FC = () => {
  return (
    <main className="container2 flex flex-col items-center gap-4 pt-6">
      <article className="flex w-full flex-col gap-4">
        <Adder />
        <TodoList />
      </article>
    </main>
  );
};

export default Index;

export const Route = createFileRoute("/_authenticated/")({
  component: Index,
});
