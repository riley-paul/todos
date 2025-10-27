import { qLists, qUser } from "@/app/lib/queries";
import type { UserSelect } from "@/lib/types";
import {
  useQueryClient,
  useSuspenseQuery,
  type QueryClient,
} from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { useChannel } from "ably/react";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import React from "react";
import { CircleCheckBigIcon } from "lucide-react";
import { Heading, Separator } from "@radix-ui/themes";
import UserMenu from "../components/user-menu";
import ListChips from "../components/list/list-chips";
import ConnectionState from "../components/connection-state";

type RouterContext = {
  queryClient: QueryClient;
  currentUser: UserSelect;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Component,
  loader: async ({ context }) => {
    const lists = context.queryClient.ensureQueryData(qLists);
    const user = await context.queryClient.ensureQueryData(qUser);
    return { user, lists };
  },
});

function Component() {
  const queryClient = useQueryClient();
  const { currentUser } = Route.useRouteContext();

  useChannel(`user:${currentUser.id}`, "invalidate", () => {
    console.log("Invalidating...");
    queryClient.invalidateQueries();
  });

  const { data: lists } = useSuspenseQuery(qLists);

  return (
    <React.Fragment>
      <header className="bg-background sticky top-0 z-10 flex h-18 flex-col justify-center">
        <div className="container2 flex flex-1 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <CircleCheckBigIcon className="text-accent-10 size-6" />
            <Heading size="4">Todos</Heading>
          </Link>
          <section className="flex items-center gap-3">
            {/*<Invites />*/}
            {/*<SearchLink />*/}
            <ConnectionState />
            <UserMenu user={currentUser} />
          </section>
        </div>
        <div className="container2 px-2">
          <Separator size="4" />
        </div>
      </header>
      <main className="container2 grid gap-6 py-6">
        <ListChips lists={lists} />
        <Outlet />
      </main>
      {import.meta.env.DEV && (
        <TanStackRouterDevtools position="bottom-right" />
      )}
    </React.Fragment>
  );
}
