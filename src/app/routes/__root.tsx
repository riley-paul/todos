import PendingInvites from "@/components/pending-invites";
import UserAvatar from "@/components/user-avatar";
import useQueryStream from "@/hooks/use-query-stream";
import { Heading } from "@radix-ui/themes";
import { useQueryClient } from "@tanstack/react-query";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: Component,
});

function Component() {
  const queryClient = useQueryClient();
  const { StreamStateIcon } = useQueryStream(queryClient);

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-panel-translucent backdrop-blur">
        <div className="container2">
          <div className="flex items-center justify-between px-rx-3 py-rx-3">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-check-double text-7 text-accent-9" />
              <Heading asChild size="6" weight="bold">
                <Link to="/">Todos</Link>
              </Heading>
              <div className="ml-2">
                <StreamStateIcon />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <PendingInvites />
              <UserAvatar />
            </div>
          </div>
        </div>
      </header>
      <div className="pb-24 pt-6">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  );
}
