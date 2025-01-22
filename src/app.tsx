import React from "react";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import useQueryStream from "@/hooks/use-query-stream";
import TodoAdder from "@/components/todo-adder";
import Lists from "@/components/lists";
import Todos from "@/components/todos";
import { handleMutationError } from "@/hooks/use-mutations";
import { NuqsAdapter } from "nuqs/adapters/react";
import RadixProvider from "./components/radix-provider";
import ListEditor from "./components/list-editor";
import RefreshButton from "./components/refresh-button";
import { Heading } from "@radix-ui/themes";
import PendingInvites from "./components/pending-invites";
import UserAvatar from "./components/user-avatar";

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
  const { StreamStateIcon } = useQueryStream(queryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <RadixProvider>
          <header className="sticky top-0 z-50 border-b bg-panel-translucent backdrop-blur">
            <div className="container2">
              <div className="flex items-center justify-between px-rx-3 py-rx-3">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-check-double text-7 text-accent-9" />
                  <Heading size="6" weight="bold">
                    Todos
                  </Heading>
                  <div className="ml-2">
                    <StreamStateIcon />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <PendingInvites />
                  <UserAvatar />
                </div>
              </div>
            </div>
          </header>
          <main className="container2 grid gap-rx-4 py-rx-6 pb-24">
            <TodoAdder />
            <Lists />
            <Todos />
          </main>
          <div className="fixed bottom-8 right-8 flex items-center gap-3">
            <RefreshButton />
            <ListEditor />
          </div>
        </RadixProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
};

export default App;
