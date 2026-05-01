import { RouterProvider } from "@tanstack/react-router";

// Import the generated route tree
import RadixProvider from "@/app/providers/radix-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import CustomToaster from "./components/ui/custom-toaster";
import AlertSystem from "./components/alert-system/alert-system";
import RealtimeProvider from "./providers/realtime-provider";
import type { UserSelect } from "@/lib/types";
import useServiceWorker from "./hooks/use-service-worker";
import { UserProvider } from "./providers/user-provider";
import { router } from "./lib/router";
import { queryClient } from "./lib/query-client";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

type Props = { currentUser: UserSelect };

const App: React.FC<Props> = ({ currentUser }) => {
  useServiceWorker();
  return (
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
  );
};

export default App;
