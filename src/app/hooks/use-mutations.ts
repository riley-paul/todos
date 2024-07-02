import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/client";
import { todosQueryOptions } from "../lib/queries";
import { toast } from "sonner";
import React from "react";

export default function useMutations() {
  const client = useQueryClient();
  const toastId = React.useRef<string | number | undefined>();
  const queryKey = todosQueryOptions.queryKey;

  const onError = (error: Error) => {
    console.error(error);
    toast.error(error.message, { id: toastId.current });
  };

  const completeTodo = useMutation({
    mutationFn: async (props: { id: string; complete: boolean }) => {
      const { id, complete } = props;
      await api.todos["toggle-complete"].$post({ json: { id, complete } });
    },
    onSuccess: async () => {
      client.invalidateQueries({ queryKey });
    },
    onError,
  });

  const deleteTodo = useMutation({
    mutationFn: async (props: { id: string }) => {
      const { id } = props;
      await api.todos.delete.$post({ json: { id } });
    },
    onSuccess: async () => {
      client.invalidateQueries({ queryKey });
    },
    onError,
  });

  const deleteCompleted = useMutation({
    mutationFn: () => api.todos["delete-completed"].$post(),
    onSuccess: async () => {
      client.invalidateQueries({ queryKey });
    },
    onError,
  });

  const createTodo = useMutation({
    mutationFn: (text: string) => api.todos.$post({ json: { text } }),
    onSuccess: async () => {
      client.invalidateQueries({ queryKey });
    },
    onError,
  });

  return { completeTodo, deleteTodo, deleteCompleted, createTodo };
}
