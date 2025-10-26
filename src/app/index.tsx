import { RouterProvider, createRouter } from "@tanstack/react-router";
import { AblyProvider, ChannelProvider } from "ably/react";
import * as Ably from "ably";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import RadixProvider from "@/app/components/radix-provider";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { handleMutationError } from "@/app/hooks/use-mutations";
import { qUser } from "@/lib/client/queries";
import LoadingScreen from "./components/screens/loading";
import NotFoundScreen from "./components/screens/not-found";
import ErrorScreen from "./components/screens/error";
import CustomToaster from "./components/ui/custom-toaster";
import AlertSystem from "./components/alert-system/alert-system";

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

const currentUser = await queryClient.ensureQueryData(qUser);

const router = createRouter({
  routeTree,
  context: { queryClient, currentUser },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: LoadingScreen,
  defaultNotFoundComponent: NotFoundScreen,
  defaultErrorComponent: ErrorScreen,
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
    <ChannelProvider channelName={`user:${currentUser.id}`}>
      <QueryClientProvider client={queryClient}>
        <RadixProvider>
          <RouterProvider router={router} />
          <CustomToaster />
          <AlertSystem />
        </RadixProvider>
      </QueryClientProvider>
    </ChannelProvider>
  </AblyProvider>
);
