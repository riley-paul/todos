import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actions } from "astro:actions";
import { qList, qLists, qMe, qTodosForList } from "../lib/queries";
import { useParams } from "@tanstack/react-router";
import type { ListSelectDetails } from "@/lib/types";

type Updater<T> = (prev: T) => Partial<T>;

export default function useMutations() {
  const queryClient = useQueryClient();
  const { listId: currentListId } = useParams({ strict: false });

  const updateList = (listId: string, updater: Updater<ListSelectDetails>) => {
    queryClient.setQueryData(qList(listId).queryKey, (prev) => {
      if (!prev) return prev;
      const changes = updater(prev);
      return { ...prev, ...changes };
    });

    queryClient.setQueryData(qLists().queryKey, (prev) => {
      if (!prev) return prev;
      return prev.map((list) => {
        if (list.id !== listId) return list;
        const changes = updater(list);
        return { ...list, ...changes };
      });
    });
  };

  return {
    updateUserMutation: useMutation({
      mutationFn: actions.users.update.orThrow,
      onSuccess: (data) => {
        queryClient.setQueryData(qMe().queryKey, (prev) => {
          if (!prev) return prev;
          return { ...prev, ...data };
        });
      },
    }),
    createTodoMutation: useMutation({
      mutationFn: actions.todos.create.orThrow,
      onSuccess: (data) => {
        queryClient.setQueryData(
          qTodosForList(data.listId).queryKey,
          (prev) => {
            if (!prev) return prev;
            return [data, ...prev];
          },
        );

        updateList(data.listId, (prev) => ({ todoCount: prev.todoCount + 1 }));
      },
    }),
    updateTodoMutation: useMutation({
      mutationFn: actions.todos.update.orThrow,
      onSuccess: (data) => {
        if (!currentListId) return;

        queryClient.setQueryData(
          qTodosForList(currentListId).queryKey,
          (prev) => {
            if (!prev) return prev;
            return prev.map((todo) =>
              todo.id === data.id ? { ...todo, ...data } : todo,
            );
          },
        );

        updateList(data.listId, (prev) => ({ todoCount: prev.todoCount - 1 }));
      },
    }),
  };
}
