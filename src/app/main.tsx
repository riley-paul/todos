import { createRouter, RouterProvider } from "@tanstack/react-router";

// Import the generated route tree
import RadixProvider from "@/app/providers/radix-provider";
import CustomToaster from "./components/ui/custom-toaster";
import AlertSystem from "./components/alert-system/alert-system";
import type { UserSelect, UserSessionInfo } from "@/lib/types";
import useServiceWorker from "./hooks/use-service-worker";
import { UserProvider } from "./providers/user-provider";
import RealtimeProvider from "./providers/realtime-provider";
import { routeTree } from "./routeTree.gen";
import LoadingScreen from "./components/screens/loading";
import NotFoundScreen from "./components/screens/not-found";
import ErrorScreen from "./components/screens/error";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  mutationCache: new MutationCache({
    onSuccess: () => {
      // queryClient.invalidateQueries();
    },
    onError: (error) => {
      toast.error("Oops! Something went wrong.", {
        description: error.message,
      });
      console.error(error);
    },
  }),
});

const router = createRouter({
  routeTree,
  context: { queryClient },
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

type Props = { currentUser: UserSelect; currentUserSession: UserSessionInfo };

const App: React.FC<Props> = ({ currentUser, currentUserSession }) => {
  useServiceWorker();
  return (
    <UserProvider user={currentUser} userSession={currentUserSession}>
      <RealtimeProvider>
        <RadixProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <CustomToaster />
            <AlertSystem />
          </QueryClientProvider>
        </RadixProvider>
      </RealtimeProvider>
    </UserProvider>
  );
};

export default App;
