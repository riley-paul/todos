import { RouterProvider, createRouter } from "@tanstack/react-router";
import { AblyProvider } from "ably/react";
import * as Ably from "ably";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import RadixProvider from "@/components/radix-provider";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { handleMutationError } from "@/hooks/use-mutations";
import CustomToaster from "@/components/ui/custom-toaster";
import { Spinner } from "@radix-ui/themes";
import ErrorPage from "@/components/error-page";

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

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: () => (
    <section className="flex h-full items-center justify-center gap-2 py-32">
      <Spinner size="3" />
    </section>
  ),
  defaultErrorComponent: ({ error }) => <ErrorPage error={error} goHome />,
});

const realtimeClient = new Ably.Realtime({ authUrl: "/ably-auth" });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
export default () => (
  <AblyProvider client={realtimeClient}>
    <QueryClientProvider client={queryClient}>
      <RadixProvider>
        <RouterProvider router={router} />
        <CustomToaster />
      </RadixProvider>
    </QueryClientProvider>
  </AblyProvider>
);
