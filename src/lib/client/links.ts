import { linkOptions } from "@tanstack/react-router";

export const goToList = (listId: string | null | undefined) =>
  linkOptions({
    to: listId ? "/todos/$listId" : "/",
    params: { listId },
  });

export const goToListEditor = (listId: string | null | undefined) =>
  linkOptions({
    to: listId ? "/list/$listId/edit" : "/",
    params: { listId },
  });
