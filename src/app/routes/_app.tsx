import { createFileRoute, redirect } from "@tanstack/react-router";
import { api } from "../lib/client";

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ location }) => {
    const me = await api.auth.me.$get().then((res) => res.json());
    if (!me) {
      throw redirect({
        to: "/welcome",
        search: { redirect: location.href },
      });
    }
  },
});
