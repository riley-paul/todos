import ListSwitcher from "@/components/list-switcher";
import UserAvatar from "@/components/user-avatar";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { CircleCheckBig } from "lucide-react";

export const Route = createRootRoute({
  component: () => (
    <>
      <header className="sticky top-0 z-50 h-16 border-b bg-background">
        <div className="container2 flex h-full items-center justify-between">
          <div className="flex items-end gap-2">
            <Link to="/">
              <div className="flex items-center gap-2">
                <CircleCheckBig size="1.5rem" className="text-primary" />
                <div className="text-2xl font-bold">Todos</div>
              </div>
            </Link>
            <ListSwitcher />
          </div>
          <UserAvatar user={null} />
        </div>
      </header>
      <slot />
      <Outlet />
    </>
  ),
});
