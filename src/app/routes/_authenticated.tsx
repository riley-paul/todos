import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { userQueryOptions } from "../lib/queries";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location }) => {
    const { queryClient } = context;
    await queryClient
      .fetchQuery(userQueryOptions)
      .then((data) => {
        if (!data) {
          throw redirect({ to: "/welcome" });
        }
      })
      .catch(() => {
        throw redirect({ to: "/welcome" });
      });
  },
});
