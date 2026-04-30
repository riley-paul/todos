import { createRouter } from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen";
import LoadingScreen from "../components/screens/loading";
import NotFoundScreen from "../components/screens/not-found";
import ErrorScreen from "../components/screens/error";

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: LoadingScreen,
  defaultNotFoundComponent: NotFoundScreen,
  defaultErrorComponent: ErrorScreen,
});
