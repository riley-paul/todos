import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import Adder from "./adder";
import TodoList from "./todo-list";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="container2 flex flex-col items-center gap-4 pt-6">
        <article className="flex flex-col gap-4 w-full">
          <Adder />
          <TodoList />
        </article>
      </main>
    </QueryClientProvider>
  );
};

export default App;
