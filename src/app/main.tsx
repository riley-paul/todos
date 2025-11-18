import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import RadixProvider from "@/app/providers/radix-provider";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import LoadingScreen from "./components/screens/loading";
import NotFoundScreen from "./components/screens/not-found";
import ErrorScreen from "./components/screens/error";
import CustomToaster from "./components/ui/custom-toaster";
import AlertSystem from "./components/alert-system/alert-system";
import { handleError } from "./lib/errors";
import RealtimeProvider from "./providers/realtime-provider";
import type { UserSelect } from "@/lib/types";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  mutationCache: new MutationCache({
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      handleError(error);
    },
  }),
});

const router = createRouter({
  routeTree,
  context: { queryClient, currentUser: null as unknown as UserSelect },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: LoadingScreen,
  defaultNotFoundComponent: NotFoundScreen,
  defaultErrorComponent: ErrorScreen,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

type Props = { currentUser: UserSelect };

const App: React.FC<Props> = ({ currentUser }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <RealtimeProvider currentUser={currentUser}>
        <RadixProvider>
          <RouterProvider
            router={router}
            context={{ queryClient, currentUser }}
          />
          <CustomToaster />
          <AlertSystem />
        </RadixProvider>
      </RealtimeProvider>
    </QueryClientProvider>
  );
};

export default App;
