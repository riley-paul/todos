import AlertSystem from "@/app/components/alert-system/alert-system";
import { qLists, qUser } from "@/lib/client/queries";
import type { UserSelect } from "@/lib/types";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { useChannel } from "ably/react";

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

  return (
    <>
      <Outlet />
      <AlertSystem />
    </>
  );
}
