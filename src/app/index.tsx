import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import RadixProvider from "@/components/radix-provider";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react";
import { handleMutationError } from "@/hooks/use-mutations";
import CustomToaster from "@/components/ui/custom-toaster";

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

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
export default () => (
  <QueryClientProvider client={queryClient}>
    <NuqsAdapter>
      <RadixProvider>
        <RouterProvider router={router} />;
        <CustomToaster />
      </RadixProvider>
    </NuqsAdapter>
  </QueryClientProvider>
);
