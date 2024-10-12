import React from "react";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/header";
import useQueryStream from "@/hooks/use-query-stream";
import Adder from "@/components/adder";
import Lists from "@/components/lists";
import TodoList from "@/components/todo-list";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  mutationCache: new MutationCache({
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  }),
});

const App: React.FC = () => {
  useQueryStream(queryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Header />
        <main className="container2 grid gap-6 py-6">
          <Adder />
          <Lists />
          <TodoList />
        </main>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
