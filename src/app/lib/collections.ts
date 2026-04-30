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
  type ListSelect,
} from "@/lib/types2";
import { toast } from "sonner";
import { router } from "./router";

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
    schema: zTodoSelect,
    onInsert: async ({ transaction }) =>
      Promise.all(
        transaction.mutations.map(({ modified }) =>
          actions.todos2.create.orThrow(modified),
        ),
      ),
    onUpdate: async ({ transaction }) =>
      Promise.all(
        transaction.mutations.map(({ original, changes }) =>
          actions.todos2.update.orThrow({ todoId: original.id, data: changes }),
        ),
      ),
    onDelete: async ({ transaction }) =>
      Promise.all(
        transaction.mutations.map(({ original }) =>
          actions.todos2.remove.orThrow({ todoId: original.id }),
        ),
      ),
  }),
);

export const lists = createCollection(
  queryCollectionOptions({
    ...sharedOptions,
    queryKey: ["lists"],
    queryFn: actions.lists2.populate.orThrow,
    schema: zListSelect,
    onInsert: async ({ transaction }) =>
      Promise.all(
        transaction.mutations.map(({ modified }) =>
          actions.lists2.create.orThrow(modified),
        ),
      ),
    onUpdate: async ({ transaction }) =>
      Promise.all(
        transaction.mutations.map(({ original, changes }) =>
          actions.lists2.update.orThrow({ listId: original.id, data: changes }),
        ),
      ),
    onDelete: async ({ transaction }) =>
      Promise.all(
        transaction.mutations.map(({ original }) =>
          actions.lists2.remove.orThrow({ listId: original.id }),
        ),
      ),
  }),
);

export const listUsers = createCollection(
  queryCollectionOptions({
    ...sharedOptions,
    queryKey: ["listUsers"],
    queryFn: actions.listUsers2.populate.orThrow,
    schema: zListUserSelect,
  }),
);

export const users = createCollection(
  queryCollectionOptions({
    ...sharedOptions,
    queryKey: ["users"],
    queryFn: actions.users2.populate.orThrow,
    schema: zUserSelect,
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
      await actions.todos2.deleteCompleted.orThrow({ listId });
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
      await actions.todos2.uncheckCompleted.orThrow({ listId });
      await todos.utils.refetch();
    },
  }),
  insertList: createOptimisticAction<{ list: ListSelect; userId: string }>({
    onMutate: ({ list, userId }) => {
      lists.insert(list);
      listUsers.insert({
        id: crypto.randomUUID(),
        listId: list.id,
        userId,
        show: true,
        isPending: false,
        order: 1_000_000,
      });
      toast.success(`List "${list.name}" created`);
    },
    mutationFn: async ({ list }) => {
      await actions.lists2.create.orThrow(list);
      await lists.utils.refetch();
      await listUsers.utils.refetch();
      router.navigate({ to: "/todos/$listId", params: { listId: list.id } });
    },
  }),
};
