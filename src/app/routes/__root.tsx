import { qLists, qUser } from "@/app/lib/queries";
import { type QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import React from "react";
import ListChips from "../components/list/list-chips";
import type { UserSelect } from "@/lib/types";
import AppHeader from "../components/app-header";

type RouterContext = {
  queryClient: QueryClient;
  currentUser: UserSelect;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Component,
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(qLists);
    const user = await context.queryClient.ensureQueryData(qUser);
    return { user };
  },
});

function Component() {
  const { currentUser } = Route.useRouteContext();
  return (
    <React.Fragment>
      <AppHeader currentUser={currentUser} />
      <main className="container2 grid gap-6 py-6">
        <ListChips />
        <Outlet />
      </main>
      {import.meta.env.DEV && (
        <TanStackRouterDevtools position="bottom-right" />
      )}
    </React.Fragment>
  );
}
