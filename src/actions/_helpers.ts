import type { ActionAPIContext } from "astro/actions/runtime/utils.js";
import { ActionError } from "astro:actions";

export const isAuthorized = (context: ActionAPIContext) => {
  const user = context.locals.user;
  if (!user) {
    throw new ActionError({
      code: "UNAUTHORIZED",
      message: "You are not logged in.",
    });
  }
  return user;
};
