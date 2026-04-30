import { BasicIndex, createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { queryClient } from "@/app/lib/query-client";
import { actions } from "astro:actions";

const sharedOptions = {
  queryClient,
  autoIndex: "eager",
  defaultIndexType: BasicIndex,
  getKey: (item: { id: string }) => item.id,
} as const;

export const todos = createCollection(
  queryCollectionOptions({
    ...sharedOptions,
    queryKey: ["todos"],
    queryFn: actions.todos2.populate.orThrow,
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
    ...sharedOptions,
    queryKey: ["lists"],
    queryFn: actions.lists2.populate.orThrow,
  }),
);

export const listUsers = createCollection(
  queryCollectionOptions({
    ...sharedOptions,
    queryKey: ["listUsers"],
    queryFn: actions.listUsers2.populate.orThrow,
  }),
);

export const users = createCollection(
  queryCollectionOptions({
    ...sharedOptions,
    queryKey: ["users"],
    queryFn: actions.users2.populate.orThrow,
  }),
);
