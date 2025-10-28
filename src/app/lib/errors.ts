import { ActionInputError, isActionError } from "astro:actions";
import { toast } from "sonner";

export const handleError = (error: Error) => {
  console.error(error);

  let status = 500;
  let title = "Error";
  let description = error.message;

  if (isActionError(error)) {
    title = error.name;
    status = error.status;
    description = error.message;
  }

  if (error instanceof ActionInputError) {
    title = error.name;
    status = 400;
    description = error.issues.map((issue) => issue.message).join(", ");
  }

  toast.error(`${status} - ${title}`, { description });
};
