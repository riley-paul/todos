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
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: "/graphql", useGETForQueries: true }),
  cache: new InMemoryCache(),
});

const router = createRouter({
  routeTree,
  context: { apolloClient },
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
  if (!currentUser || !currentUserSession) return null;
  return (
    <ApolloProvider client={apolloClient}>
      <UserProvider user={currentUser} userSession={currentUserSession}>
        <RealtimeProvider>
          <RadixProvider>
            <RouterProvider router={router} />
            <CustomToaster />
            <AlertSystem />
          </RadixProvider>
        </RealtimeProvider>
      </UserProvider>
    </ApolloProvider>
  );
};

export default App;
