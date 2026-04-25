import { type QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import React from "react";
import ListChips from "../components/list/list-chips";
import type { UserSelect } from "@/lib/types";
import AppHeader from "../components/app-header";
import type { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import {
  GetMeDocument,
  type GetMeQuery,
  type GetMeQueryVariables,
} from "../gql.gen";

type RouterContext = {
  queryClient: QueryClient;
  apolloClient: ApolloClient<NormalizedCacheObject>;
  currentUser: UserSelect;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Component,
  loader: async ({ context: { apolloClient } }) => {
    const {
      data: { me },
    } = await apolloClient.query<GetMeQuery, GetMeQueryVariables>({
      query: GetMeDocument,
    });
    return { user: me };
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
