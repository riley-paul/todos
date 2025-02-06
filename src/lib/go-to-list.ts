import { linkOptions } from "@tanstack/react-router";

const goToList = (listId: string | null | undefined) =>
  linkOptions({
    to: listId ? "/todos/$listId" : "/",
    params: { listId },
  });

export default goToList;
