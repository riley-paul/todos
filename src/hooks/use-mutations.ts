import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hashtagQueryOptions } from "../lib/queries";
import { toast } from "sonner";
import { actions } from "astro:actions";
import useMutationHelpers from "./use-mutation-helpers";

export default function useMutations() {
  const client = useQueryClient();
  const todosQueryKey = ["todos"];
  const tagsQueryKey = hashtagQueryOptions.queryKey;

  const { onError, onMutateMessage, invalidateQueries, toastId } =
    useMutationHelpers();

  const updateTodo = useMutation({
    mutationFn: actions.updateTodo.orThrow,
    onSuccess: () => {
      invalidateQueries([todosQueryKey, tagsQueryKey]);
    },
    onError,
  });

  const undoDeleteTodo = useMutation({
    mutationFn: actions.undoDeleteTodo.orThrow,
    onMutate: () => {
      onMutateMessage("Restoring todo...");
    },
    onSuccess: () => {
      invalidateQueries([todosQueryKey, tagsQueryKey]);
      toast.success("Todo restored", { id: toastId.current });
    },
    onError,
  });

  const deleteTodo = useMutation({
    mutationFn: actions.deleteTodo.orThrow,
    onMutate: () => {
      onMutateMessage("Deleting todo...");
    },
    onSuccess: (id) => {
      invalidateQueries([todosQueryKey, tagsQueryKey]);
      toast.success("Todo deleted", {
        id: toastId.current,
        action: { label: "Undo", onClick: () => undoDeleteTodo.mutate({ id }) },
      });
    },
    onError,
  });

  const deleteCompleted = useMutation({
    mutationFn: actions.deleteCompletedTodos.orThrow,
    onSuccess: () => {
      invalidateQueries([todosQueryKey, tagsQueryKey]);
    },
    onError,
  });

  const createTodo = useMutation({
    mutationFn: actions.createTodo.orThrow,
    onSuccess: () => {
      invalidateQueries([todosQueryKey, tagsQueryKey]);
    },
    onError,
  });

  const deleteUser = useMutation({
    mutationFn: actions.deleteUser.orThrow,
    onSuccess: () => {
      client.clear();
      window.location.href = "/";
    },
    onError,
  });

  return {
    updateTodo,
    deleteTodo,
    deleteCompleted,
    createTodo,
    deleteUser,
  };
}
