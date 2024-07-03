import { createLazyFileRoute } from "@tanstack/react-router";

import LoginButton from "@/app/components/login-button";
import { Check, CircleCheckBig } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import DeleteButton from "../components/ui/delete-button";
import { cn } from "../lib/utils";

type SampleTodo = {
  id: string;
  text: string;
  isCompleted: boolean;
};

const TodoItemSample: React.FC<{ todo: SampleTodo }> = ({ todo }) => (
  <Card
    className={cn(
      "flex items-center gap-2 rounded-md p-2 text-sm",
      todo.isCompleted && "bg-card/50",
    )}
  >
    <Button
      variant={todo.isCompleted ? "secondary" : "ghost"}
      className="rounded-full"
      size="icon"
    >
      <Check size="1rem" />
    </Button>
    <span
      className={cn(
        "flex-1",
        todo.isCompleted && "text-muted-foreground line-through",
      )}
    >
      {todo.text}
    </span>
    <DeleteButton handleDelete={() => {}} />
  </Card>
);

const sampleTodos: SampleTodo[] = [
  {
    id: "1",
    text: "Buy groceries",
    isCompleted: false,
  },
  {
    id: "2",
    text: "Find the meaning of life",
    isCompleted: false,
  },
  {
    id: "3",
    text: "Learn Astro web framework",
    isCompleted: true,
  },
];

export const Route = createLazyFileRoute("/welcome")({
  component: () => (
    <main className="container2 flex min-h-[100svh] flex-col gap-6 pt-[10vh]">
      <div className="flex items-center justify-center">
        <CircleCheckBig size="5rem" className="text-primary" />
      </div>
      <section className="prose w-full max-w-none text-center dark:prose-invert prose-h1:mb-2 prose-h1:text-5xl">
        <h1 className="">Todos</h1>
        <p className="">A robust and feature-poor todo app</p>
      </section>
      <div className="grid gap-2">
        <LoginButton provider="google" />
        <LoginButton provider="github" />
      </div>

      <div className="flex w-full flex-col gap-2">
        {sampleTodos.map((todo) => (
          <TodoItemSample todo={todo} key={todo.text} />
        ))}
      </div>
    </main>
  ),
});
