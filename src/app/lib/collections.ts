import { actions } from "astro:actions";
import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import {
  zBaseListSelect,
  zBaseListUserSelect,
  zBaseTodoSelect,
  zBaseUserSelect,
} from "@/lib/types";
import { QueryClient } from "@tanstack/query-core";

const queryClient = new QueryClient();

export const todoCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ["todos"],
    queryFn: actions.todos.populate.orThrow,
    schema: zBaseTodoSelect,
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) =>
      Promise.all(
        transaction.mutations.map(({ modified }) =>
          actions.todos.create.orThrow({ data: modified }),
        ),
      ),
    onUpdate: async ({ transaction }) =>
      Promise.all(
        transaction.mutations.map(({ original, modified }) =>
          actions.todos.update.orThrow({ id: original.id, data: modified }),
        ),
      ),
    onDelete: async ({ transaction }) => {
      Promise.all(
        transaction.mutations.map(({ original }) =>
          actions.todos.remove.orThrow({ id: original.id }),
        ),
      );
    },
  }),
);

export const listCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ["lists"],
    queryFn: actions.lists.populate.orThrow,
    schema: zBaseListSelect,
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) =>
      Promise.all(
        transaction.mutations.map(({ modified }) =>
          actions.lists.create.orThrow({ data: modified }),
        ),
      ),
    onUpdate: async ({ transaction }) =>
      Promise.all(
        transaction.mutations.map(({ original, modified }) =>
          actions.lists.update.orThrow({ id: original.id, data: modified }),
        ),
      ),
    onDelete: async ({ transaction }) => {
      Promise.all(
        transaction.mutations.map(({ original }) =>
          actions.lists.remove.orThrow({ id: original.id }),
        ),
      );
    },
  }),
);

export const listUserCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ["listUsers"],
    queryFn: actions.listUsers.populate.orThrow,
    schema: zBaseListUserSelect,
    getKey: (item) => item.id,
    onUpdate: async ({ transaction }) =>
      Promise.all(
        transaction.mutations.map(({ original, modified }) =>
          actions.listUsers.update.orThrow({ id: original.id, data: modified }),
        ),
      ),
  }),
);

export const userCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ["users"],
    queryFn: actions.users.populate.orThrow,
    schema: zBaseUserSelect,
    getKey: (item) => item.id,
  }),
);
