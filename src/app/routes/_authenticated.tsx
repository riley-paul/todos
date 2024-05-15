import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { userQueryOptions } from "../lib/queries";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location }) => {
    const { queryClient } = context;
    const user = await queryClient.fetchQuery(userQueryOptions);
    if (!user) {
      throw redirect({
        to: "/welcome",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: () => <Outlet />,
});
