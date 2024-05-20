import Adder from "./components/adder";
import TodoList from "./components/todo-list";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a query client
const queryClient = new QueryClient();

// Render the app
export default () => (
  <QueryClientProvider client={queryClient}>
    <main className="container2 flex flex-col items-center gap-4 pt-6">
      <article className="flex w-full flex-col gap-4">
        <Adder />
        <TodoList />
      </article>
    </main>
  </QueryClientProvider>
);
