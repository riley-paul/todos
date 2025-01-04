import React from "react";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Header from "@/components/header";
import useQueryStream from "@/hooks/use-query-stream";
import TodoAdder from "@/components/todo-adder";
import Lists from "@/components/lists";
import Todos from "@/components/todos";
import { handleMutationError } from "@/hooks/use-mutations";
import { NuqsAdapter } from "nuqs/adapters/react";
import RadixProvider from "./components/radix-provider";
import ListEditor from "./components/list-editor";
import { Toaster } from "sonner";
import { useIsMobile } from "./hooks/use-is-mobile";
import { IconButton, Tooltip } from "@radix-ui/themes";

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
  const isMobile = useIsMobile();

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <RadixProvider>
          <Header />
          <main className="container2 grid gap-rx-4 py-rx-6 pb-24">
            <TodoAdder />
            <Lists />
            <Todos />
          </main>
          <Toaster
            theme="system"
            position={isMobile ? "top-center" : "bottom-center"}
            richColors
          />
          <div className="fixed bottom-8 right-8 flex flex-col items-center gap-3">
            <Tooltip content="Refresh data" side="left">
              <IconButton
                radius="full"
                variant="soft"
                onClick={() => queryClient.invalidateQueries()}
              >
                <i className="fa-solid fa-rotate" />
              </IconButton>
            </Tooltip>
            <ListEditor />
          </div>
        </RadixProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
};

export default App;
