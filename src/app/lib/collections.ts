import { actions } from "astro:actions";
import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import {
  zListSelect,
  zListUserSelect,
  zTodoSelect,
  zUserSelect,
} from "@/lib/types";
import { QueryClient } from "@tanstack/query-core";

const queryClient = new QueryClient();

export const todoCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ["todos"],
    queryFn: actions.todos.populate.orThrow,
    schema: zTodoSelect,
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
    schema: zListSelect,
    getKey: (item) => item.id,
    // Handle all CRUD operations
    onInsert: async ({ transaction }) => {
      const { modified } = transaction.mutations[0];
      await actions.lists.create.orThrow({ data: modified });
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

export const listUserCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ["listUsers"],
    queryFn: actions.listUsers.populate.orThrow,
    schema: zListUserSelect,
    getKey: (item) => item.id,
    // Handle all CRUD operations
    // onInsert: async ({ transaction }) => {
    //   const { modified: newListUser } = transaction.mutations[0];
    //   await actions.listUsers.create.orThrow({
    //     listId: newListUser.listId,
    //     userEmail: newListUser.user.email,
    //   });
    // },
    // onUpdate: async ({ transaction }) => {
    //   const { original, modified } = transaction.mutations[0];
    //   // No update action for list users in this example
    // },
    // onDelete: async ({ transaction }) => {
    //   const { original } = transaction.mutations[0];
    //   await actions.listUsers.remove.orThrow({ listUserId: original.id });
    // },
  }),
);

export const userCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ["users"],
    queryFn: actions.users.populate.orThrow,
    schema: zUserSelect,
    getKey: (item) => item.id,
    // No CRUD operations defined for users in this example
  }),
);
