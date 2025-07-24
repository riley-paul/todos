import AlertSystem from "@/components/alert-system/alert-system";
import AppSearch from "@/components/app-search";
import ConnectionState from "@/components/connection-state";
import UserMenu from "@/components/user-menu";
import { qUser } from "@/lib/client/queries";
import { Heading } from "@radix-ui/themes";
import { type QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { CircleCheckBigIcon } from "lucide-react";

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Component,
  loader: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(qUser);
    return { user };
  },
});

function Component() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-panel-translucent backdrop-blur">
        <div className="container2">
          <div className="flex items-center justify-between px-3 py-3">
            <div className="flex items-center gap-2">
              <CircleCheckBigIcon className="size-6 text-accent-10" />
              <Heading asChild size="6" weight="bold">
                <Link to="/">Todos</Link>
              </Heading>
              <div className="ml-2">
                <ConnectionState />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <AppSearch />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>
      <div className="container2 pb-24 pt-6">
        <Outlet />
      </div>
      <AlertSystem />
    </>
  );
}
