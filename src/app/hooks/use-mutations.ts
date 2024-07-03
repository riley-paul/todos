import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { api } from "../lib/client";
import {
  hashtagQueryOptions,
  todosQueryOptions,
  userQueryOptions,
} from "../lib/queries";
import { toast } from "sonner";
import React from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

export default function useMutations() {
  const client = useQueryClient();
  const toastId = React.useRef<string | number | undefined>();
  const navigate = useNavigate();

  const { tag } = useSearch({ from: "/_app/" });
  const todosQueryKey = todosQueryOptions(tag).queryKey;
  const tagsQueryKey = hashtagQueryOptions.queryKey;
  const userQueryKey = userQueryOptions.queryKey;

  const onError = (error: Error) => {
    console.error(error);
    toast.error(error.message, { id: toastId.current });
  };

  const invalidateQueries = (queryKeys: QueryKey[]) => {
    queryKeys.forEach((queryKey) => client.invalidateQueries({ queryKey }));
  };

  const logout = useMutation({
    mutationFn: async () => {
      const res = await api.auth.logout.$post();
      if (!res.ok) {
        throw new Error("Failed to logout");
      }
    },
    onSuccess: () => {
      navigate({ to: "/welcome" });
      invalidateQueries([userQueryKey]);
    },
    onError,
  });

  const completeTodo = useMutation({
    mutationFn: async (props: { id: string; complete: boolean }) => {
      const { id, complete } = props;
      await api.todos["toggle-complete"].$post({ json: { id, complete } });
    },
    onSuccess: () => {
      invalidateQueries([todosQueryKey, tagsQueryKey]);
    },
    onError,
  });

  const deleteTodo = useMutation({
    mutationFn: async (props: { id: string }) => {
      const { id } = props;
      await api.todos.delete.$post({ json: { id } });
    },
    onSuccess: () => {
      invalidateQueries([todosQueryKey, tagsQueryKey]);
    },
    onError,
  });

  const deleteCompleted = useMutation({
    mutationFn: () => api.todos["delete-completed"].$post(),
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

  return { logout, completeTodo, deleteTodo, deleteCompleted, createTodo };
}
