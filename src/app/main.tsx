import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import Adder from "./components/adder";
import TodoList from "./components/todo-list";
import Header from "./components/header";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <main className="container2 flex flex-col items-center gap-4 pt-6">
        <article className="flex w-full flex-col gap-4">
          <Adder />
          <TodoList />
        </article>
      </main>
    </QueryClientProvider>
  );
};

export default App;
