import { RouterProvider } from "@tanstack/react-router";

// Import the generated route tree
import RadixProvider from "@/app/providers/radix-provider";
import CustomToaster from "./components/ui/custom-toaster";
import AlertSystem from "./components/alert-system/alert-system";
import type { UserSelect } from "@/lib/types";
import useServiceWorker from "./hooks/use-service-worker";
import { UserProvider } from "./providers/user-provider";
import { router } from "./lib/router";
import RealtimeProvider from "./providers/realtime-provider";

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
      <RealtimeProvider>
        <RadixProvider>
          <RouterProvider router={router} />
          <CustomToaster />
          <AlertSystem />
        </RadixProvider>
      </RealtimeProvider>
    </UserProvider>
  );
};

export default App;
