import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { queryClient } from "@/app/lib/query-client";
import { actions } from "astro:actions";

export const todos = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ["todos"],
    queryFn: actions.todos2.populate.orThrow,
    getKey: (todo) => todo.id,
    onInsert: async ({ transaction }) =>
      transaction.mutations.map(({ modified }) =>
        actions.todos2.create.orThrow(modified),
      ),
    onUpdate: async ({ transaction }) =>
      transaction.mutations.map(({ original, changes }) =>
        actions.todos2.update.orThrow({ todoId: original.id, data: changes }),
      ),
    onDelete: async ({ transaction }) =>
      transaction.mutations.map(({ original }) =>
        actions.todos2.remove.orThrow({ todoId: original.id }),
      ),
  }),
);

export const lists = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ["lists"],
    queryFn: actions.lists2.populate.orThrow,
    getKey: (list) => list.id,
  }),
);
