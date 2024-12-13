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
import { Container, Grid, Theme } from "@radix-ui/themes";

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
        <Theme appearance="dark" accentColor="mint">
          <TooltipProvider>
            <Header />
            <Container>
              <Grid py="6" gap="4">
                <Adder />
                {/* <Lists /> */}
                <Todos />
              </Grid>
            </Container>
            <ListsEditor />
            <Toaster />
          </TooltipProvider>
        </Theme>
      </NuqsAdapter>
    </QueryClientProvider>
  );
};

export default App;
