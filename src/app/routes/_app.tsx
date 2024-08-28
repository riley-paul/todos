import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
} from "@tanstack/react-router";
import UserAvatar from "../components/user-avatar";
import { userQueryOptions } from "../lib/queries";
import { CircleCheckBig } from "lucide-react";
import useScrollShadow from "../hooks/use-scroll-shadow";
import { cn } from "../lib/utils";

const Component: React.FC = () => {
  const { listRef, isScrolled } = useScrollShadow();
  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <header
        className={cn(
          "z-50 h-16 shrink-0 border-b bg-background",
          isScrolled && "shadow-md",
        )}
      >
        <div className="container2 flex h-full items-center justify-between">
          <Link to="/">
            <div className="flex items-center gap-2">
              <CircleCheckBig size="1.5rem" className="text-primary" />
              <div className="text-2xl font-bold">Todos</div>
            </div>
          </Link>
          <UserAvatar />
        </div>
      </header>
      <main ref={listRef} className="flex-1 overflow-auto">
        <div className="container2">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ location, context }) => {
    // @ts-ignore
    const { queryClient } = context;
    const me = await queryClient.ensureQueryData(userQueryOptions);
    if (!me) {
      throw redirect({
        to: "/welcome",
        search: { redirect: location.href },
      });
    }
  },
  component: Component,
});
