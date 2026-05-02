import {
  BasicIndex,
  createCollection,
  createOptimisticAction,
} from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { queryClient } from "@/app/lib/query-client";
import { actions } from "astro:actions";
import {
  zListSelect,
  zListUserSelect,
  zTodoSelect,
  zUserSelect,
} from "@/lib/types";
import { toast } from "sonner";

const sharedOptions = {
  queryClient,
  autoIndex: "eager",
  defaultIndexType: BasicIndex,
  staleTime: 1000 * 60 * 5, // 5 minutes
  getKey: (item: { id: string }) => item.id,
} as const;

export const todos = createCollection(
  queryCollectionOptions({
    ...sharedOptions,
    queryKey: ["todos"],
    queryFn: actions.todos.populate.orThrow,
    schema: zTodoSelect,
    onInsert: async ({ transaction }) => {
      const promises = transaction.mutations.map(({ modified }) =>
        actions.todos.create.orThrow(modified),
      );
      const results = await Promise.all(promises);
      todos.utils.writeInsert(results);
      return { refetch: false };
    },
    onUpdate: async ({ transaction }) => {
      const promises = transaction.mutations.map(({ original, changes }) =>
        actions.todos.update.orThrow({ todoId: original.id, data: changes }),
      );
      await Promise.all(promises);
    },
    onDelete: async ({ transaction }) => {
      const promises = transaction.mutations.map(({ original }) =>
        actions.todos.remove.orThrow({ todoId: original.id }),
      );
      const results = await Promise.all(promises);
      todos.utils.writeDelete(results);
      return { refetch: false };
    },
  }),
);

export const lists = createCollection(
  queryCollectionOptions({
    ...sharedOptions,
    queryKey: ["lists"],
    queryFn: actions.lists.populate.orThrow,
    schema: zListSelect,
    onInsert: async ({ transaction }) =>
      Promise.all(
        transaction.mutations.map(({ modified }) =>
          actions.lists.create.orThrow(modified),
        ),
      ),
    onUpdate: async ({ transaction }) =>
      Promise.all(
        transaction.mutations.map(({ original, changes }) =>
          actions.lists.update.orThrow({ listId: original.id, data: changes }),
        ),
      ),
    onDelete: async ({ transaction }) =>
      Promise.all(
        transaction.mutations.map(({ original }) =>
          actions.lists.remove.orThrow({ listId: original.id }),
        ),
      ),
  }),
);

export const listUsers = createCollection(
  queryCollectionOptions({
    ...sharedOptions,
    queryKey: ["listUsers"],
    queryFn: actions.listUsers.populate.orThrow,
    schema: zListUserSelect,
  }),
);

export const users = createCollection(
  queryCollectionOptions({
    ...sharedOptions,
    queryKey: ["users"],
    queryFn: actions.users.populate.orThrow,
    schema: zUserSelect,
    onUpdate: async ({ transaction }) =>
      Promise.all(
        transaction.mutations.map(({ changes }) =>
          actions.users.update.orThrow(changes),
        ),
      ),
  }),
);

export const fns = {
  deleteCompletedTodos: createOptimisticAction<{ listId: string }>({
    onMutate: ({ listId }) => {
      const ids = todos.toArray
        .filter((t) => t.listId === listId && t.isCompleted)
        .map((t) => t.id);
      todos.delete(ids);
      toast.success(`Deleted ${ids.length} completed todos`);
    },
    mutationFn: async ({ listId }) => {
      await actions.todos.deleteCompleted.orThrow({ listId });
      await todos.utils.refetch();
    },
  }),
  uncheckCompletedTodos: createOptimisticAction<{ listId: string }>({
    onMutate: ({ listId }) => {
      const ids = todos.toArray
        .filter((t) => t.listId === listId && t.isCompleted)
        .map((t) => t.id);
      todos.update(ids, (draft) => {
        draft.forEach((t) => {
          t.isCompleted = false;
        });
      });
      toast.success(`Unchecked ${ids.length} completed todos`);
    },
    mutationFn: async ({ listId }) => {
      await actions.todos.uncheckCompleted.orThrow({ listId });
      await todos.utils.refetch();
    },
  }),
};
