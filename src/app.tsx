import React from "react";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Header from "@/components/header";
import useQueryStream from "@/hooks/use-query-stream";
import Adder from "@/components/adder";
import Lists from "@/components/lists";
import Todos from "@/components/todos";
import { Toaster } from "@/components/ui/sonner";
import { handleMutationError } from "@/hooks/use-mutations";
import { NuqsAdapter } from "nuqs/adapters/react";
import RadixProvider from "./components/radix-provider";

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
        <RadixProvider>
          <Header />
          <main className="container2 grid gap-rx-4 py-rx-6">
            <Adder />
            <Lists />
            <Todos />
          </main>
          <Toaster />
        </RadixProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
};

export default App;
