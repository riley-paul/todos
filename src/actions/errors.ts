import { ActionError } from "astro:actions";

const actionErrors = {
  UNAUTHORIZED: new ActionError({
    code: "UNAUTHORIZED",
    message: "You are not logged in.",
  }),
  NOT_FOUND: new ActionError({
    code: "NOT_FOUND",
    message: "Entity not found",
  }),
  NO_PERMISSION: new ActionError({
    code: "FORBIDDEN",
    message: "You do not have permission to perform this action",
  }),
  DUPLICATE: new ActionError({
    code: "BAD_REQUEST",
    message: "Entity already exists",
  }),
  EMAIL_NOT_FOUND: new ActionError({
    code: "BAD_REQUEST",
    message: "Email not found",
  }),
  SHARE_WITH_SELF: new ActionError({
    code: "BAD_REQUEST",
    message: "You cannot share a list with yourself",
  }),
};

export default actionErrors;
