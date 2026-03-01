import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const qUser = queryOptions({
  queryKey: ["profile"],
  retry: false,
  queryFn: actions.users.getMe.orThrow,
});
