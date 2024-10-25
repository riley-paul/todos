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
import ListsSidebar from "@/components/lists-sidebar";
import { useMediaQuery } from "usehooks-ts";
import { HEADER_HEIGHT, MOBILE_MEDIA_QUERY } from "@/lib/constants";

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
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Header />
        <main className="container2 flex gap-4 py-6">
          {!isMobile && (
            <div
              className="sticky h-fit pl-3"
              style={{ top: `calc(${HEADER_HEIGHT} + 1.5rem)` }}
            >
              <ListsSidebar />
            </div>
          )}
          <div className="grid h-fit flex-1 gap-6">
            <Adder />
            {isMobile && <Lists />}
            <Todos />
          </div>
        </main>
        <ListsEditor />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
