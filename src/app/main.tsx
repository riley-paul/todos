import { RouterProvider } from "@tanstack/react-router";

// Import the generated route tree
import RadixProvider from "@/app/providers/radix-provider";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import CustomToaster from "./components/ui/custom-toaster";
import AlertSystem from "./components/alert-system/alert-system";
import { handleError } from "./lib/errors";
import RealtimeProvider from "./providers/realtime-provider";
import type { UserSelect } from "@/lib/types";
import useServiceWorker from "./hooks/use-service-worker";
import { UserProvider } from "./providers/user-provider";
import { router } from "./lib/router";

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

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

type Props = { currentUser: UserSelect };

const App: React.FC<Props> = ({ currentUser }) => {
  useServiceWorker();
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider user={currentUser}>
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
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;
