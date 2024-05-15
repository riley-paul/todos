import { createLazyFileRoute } from "@tanstack/react-router";
import { cn } from "@/app/lib/utils";
import { CircleCheckBig } from "lucide-react";
import { buttonVariants } from "@/app/components/ui/button";
import type { Todo } from "@/api/db/schema";
import TodoItemSample from "@/app/components/todo-sample";

const sampleTodos: Todo[] = [
  {
    id: "1",
    text: "Buy groceries",
    isCompleted: false,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    userId: "1",
  },
  {
    id: "2",
    text: "Find the meaning of life",
    isCompleted: false,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    userId: "1",
  },
  {
    id: "3",
    text: "Learn Astro web framework",
    isCompleted: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    userId: "1",
  },
];

import React from "react";

const Welcome: React.FC = () => {
  return (
    <main className="container2 flex min-h-[100svh] flex-col gap-6 pt-[10vh]">
      <div className="flex items-center justify-center">
        <CircleCheckBig size="5rem" className="text-primary" />
      </div>
      <section className="prose w-full max-w-none text-center dark:prose-invert prose-h1:mb-2 prose-h1:text-5xl">
        <h1 className="">Todos</h1>
        <p className="">A robust and feature-poor todo app</p>
      </section>
      <a
        className={cn("w-full", buttonVariants({ variant: "secondary" }))}
        href="/"
        data-astro-prefetch
      >
        Get Started
      </a>
      <div className="flex w-full flex-col gap-2">
        {sampleTodos.map((todo) => (
          <TodoItemSample todo={todo} />
        ))}
      </div>
    </main>
  );
};

export const Route = createLazyFileRoute("/welcome")({
  component: Welcome,
});
