import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import React from "react";
import ListChips from "../components/list/list-chips";
import AppHeader from "../components/app-header";
import { useUser } from "../providers/user-provider";

export const Route = createRootRoute({
  component: Component,
});

function Component() {
  const currentUser = useUser();
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
