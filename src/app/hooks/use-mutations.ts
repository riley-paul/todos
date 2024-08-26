import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { hashtagQueryOptions, todosQueryOptions } from "../lib/queries";
import { toast } from "sonner";
import React from "react";
import { useSearch } from "@tanstack/react-router";
import { actions } from "astro:actions";

export default function useMutations() {
  const client = useQueryClient();
  const toastId = React.useRef<string | number | undefined>();

  const { tag } = useSearch({ from: "/_app/" });
  const todosQueryKey = todosQueryOptions(tag).queryKey;
  const tagsQueryKey = hashtagQueryOptions.queryKey;

  const onError = (error: Error) => {
    console.error(error);
    toast.error(error.message, { id: toastId.current });
  };

  const invalidateQueries = (queryKeys: QueryKey[]) => {
    queryKeys.forEach((queryKey) => client.invalidateQueries({ queryKey }));
  };

  const updateTodo = useMutation({
    mutationFn: actions.updateTodo,
    onSuccess: () => {
      invalidateQueries([todosQueryKey, tagsQueryKey]);
    },
    onError,
  });

  const deleteTodo = useMutation({
    mutationFn: actions.deleteTodo,
    onSuccess: () => {
      invalidateQueries([todosQueryKey, tagsQueryKey]);
    },
    onError,
  });

  const deleteCompleted = useMutation({
    mutationFn: actions.deleteCompletedTodos,
    onSuccess: () => {
      invalidateQueries([todosQueryKey, tagsQueryKey]);
    },
    onError,
  });

  const createTodo = useMutation({
    mutationFn: actions.createTodo,
    onSuccess: () => {
      invalidateQueries([todosQueryKey, tagsQueryKey]);
    },
    onError,
  });

  return {
    updateTodo,
    deleteTodo,
    deleteCompleted,
    createTodo,
  };
}
