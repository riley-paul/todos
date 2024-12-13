import React from "react";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/header";
import useQueryStream from "@/hooks/use-query-stream";
import Adder from "@/components/adder";
import Lists from "@/components/lists";
import Todos from "@/components/todos";
import { Toaster } from "@/components/ui/sonner";
import { handleMutationError } from "@/hooks/use-mutations";
import ListsEditor from "@/components/lists-editor";
import { NuqsAdapter } from "nuqs/adapters/react";
import { Theme } from "@radix-ui/themes";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  mutationCache: new MutationCache({
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      handleMutationError(error);
    },
  }),
});

const App: React.FC = () => {
  useQueryStream(queryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <Theme>
          <TooltipProvider>
            <Header />
            <main className="container2 grid gap-6 py-6">
              <Adder />
              <Lists />
              <Todos />
            </main>
            <ListsEditor />
            <Toaster />
          </TooltipProvider>
        </Theme>
      </NuqsAdapter>
    </QueryClientProvider>
  );
};

export default App;
