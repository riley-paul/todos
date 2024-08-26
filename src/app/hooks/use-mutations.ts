import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { api } from "../lib/client";
import { hashtagQueryOptions, todosQueryOptions } from "../lib/queries";
import { toast } from "sonner";
import React from "react";
import { useSearch } from "@tanstack/react-router";

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

  const completeTodo = useMutation({
    mutationFn: async (props: { id: string; complete: boolean }) => {
      const { id, complete } = props;
      await api.todos[":id"].$patch({
        json: { isCompleted: complete },
        param: { id },
      });
    },
    onSuccess: () => {
      invalidateQueries([todosQueryKey, tagsQueryKey]);
    },
    onError,
  });

  const deleteTodo = useMutation({
    mutationFn: async (props: { id: string }) => {
      const { id } = props;
      await api.todos[":id"].$delete({ param: { id } });
    },
    onSuccess: () => {
      invalidateQueries([todosQueryKey, tagsQueryKey]);
    },
    onError,
  });

  const deleteCompleted = useMutation({
    mutationFn: () => api.todos.completed.$delete(),
    onSuccess: () => {
      invalidateQueries([todosQueryKey, tagsQueryKey]);
    },
    onError,
  });

  const createTodo = useMutation({
    mutationFn: (text: string) => api.todos.$post({ json: { text } }),
    onSuccess: () => {
      invalidateQueries([todosQueryKey, tagsQueryKey]);
    },
    onError,
  });

  const updateTodo = useMutation({
    mutationFn: async (props: { id: string; text: string }) => {
      const { id, text } = props;
      await api.todos[":id"].$patch({ json: { text }, param: { id } });
    },
    onSuccess: () => {
      invalidateQueries([todosQueryKey, tagsQueryKey]);
    },
    onError,
  });

  return {
    completeTodo,
    deleteTodo,
    deleteCompleted,
    createTodo,
    updateTodo,
  };
}
