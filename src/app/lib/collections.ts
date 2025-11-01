import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { actions } from "astro:actions";
import queryClient from "./client";

export const todoCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ["todos"],
    queryFn: actions.todos.populate.orThrow,
    getKey: (item) => item.id,
    // Handle all CRUD operations
    onInsert: async ({ transaction }) => {
      const { modified: newTodo } = transaction.mutations[0];
      await actions.todos.create.orThrow({ data: newTodo });
    },
    onUpdate: async ({ transaction }) => {
      const { original, modified } = transaction.mutations[0];
      await actions.todos.update.orThrow({ id: original.id, data: modified });
    },
    onDelete: async ({ transaction }) => {
      const { original } = transaction.mutations[0];
      await actions.todos.remove.orThrow({ id: original.id });
    },
  }),
);

export const listCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ["lists"],
    queryFn: actions.lists.populate.orThrow,
    getKey: (item) => item.id,
    // Handle all CRUD operations
    onInsert: async ({ transaction }) => {
      const { modified: newList } = transaction.mutations[0];
      await actions.lists.create.orThrow({ name: newList.name });
    },
    onUpdate: async ({ transaction }) => {
      const { original, modified } = transaction.mutations[0];
      await actions.lists.update.orThrow({ id: original.id, data: modified });
    },
    onDelete: async ({ transaction }) => {
      const { original } = transaction.mutations[0];
      await actions.lists.remove.orThrow({ id: original.id });
    },
  }),
);
