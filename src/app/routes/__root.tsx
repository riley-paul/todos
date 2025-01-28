import ListEditor from "@/components/list-editor";
import Lists from "@/components/lists";
import PendingInvites from "@/components/pending-invites";
import RefreshButton from "@/components/refresh-button";
import TodoAdder from "@/components/todo-adder";
import Todos from "@/components/todos";
import UserAvatar from "@/components/user-avatar";
import useQueryStream from "@/hooks/use-query-stream";
import { Heading } from "@radix-ui/themes";
import { useQueryClient } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";
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
              <Heading size="6" weight="bold">
                Todos
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
      <main className="container2 grid gap-rx-4 py-rx-6 pb-24">
        <TodoAdder />
        <Lists />
        <Todos />
      </main>
      <div className="fixed bottom-8 right-8 flex items-center gap-3">
        <RefreshButton />
        <ListEditor />
      </div>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
