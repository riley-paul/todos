import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { actions } from "astro:actions";
import { queryClient } from "./query-client";

export const todoCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ["todos"],
    queryFn: () => actions.todos.get.orThrow(),
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) => {
      const [{ modified: newTodo }] = transaction.mutations;
      actions.todos.create.orThrow(newTodo);
    },
    onUpdate: async ({ transaction }) => {
      actions.todos.update.orThrow();
    },
    onDelete: async ({ transaction }) => {
      actions.todos.remove.orThrow();
    },
  }),
);
