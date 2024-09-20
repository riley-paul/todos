import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { actions } from "astro:actions";
import useMutationHelpers from "./use-mutation-helpers";
import { type TodoSelect } from "@/lib/types";
import { hashtagQueryOptions } from "@/lib/queries";

export default function useMutations() {
  const client = useQueryClient();
  const todosQueryKey = ["todos"];
  const tagsQueryKey = hashtagQueryOptions.queryKey;

  const {
    onError,
    onMutateMessage,
    toastId,
    optimisticUpdate,
    onErrorOptimistic,
  } = useMutationHelpers();

  const updateTodo = useMutation({
    mutationFn: actions.updateTodo.orThrow,
    onMutate: async ({ id, data }) => {
      optimisticUpdate<TodoSelect[]>(tagsQueryKey, (prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, ...data } : todo)),
      );
      return optimisticUpdate<TodoSelect[]>(todosQueryKey, (prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, ...data } : todo)),
      );
    },
    onError: (error, _, context) => {
      onErrorOptimistic(tagsQueryKey, context);
      onErrorOptimistic(todosQueryKey, context);
      onError(error);
    },
  });

  const undoDeleteTodo = useMutation({
    mutationFn: actions.undoDeleteTodo.orThrow,
    onMutate: () => {
      onMutateMessage("Restoring todo...");
    },
    onSuccess: () => {
      toast.success("Todo restored", { id: toastId.current });
    },
    onError,
  });

  const deleteTodo = useMutation({
    mutationFn: actions.deleteTodo.orThrow,
    onMutate: ({ id }) => {
      onMutateMessage("Deleting todo...");
      optimisticUpdate<TodoSelect[]>(tagsQueryKey, (prev) =>
        prev.filter((todo) => todo.id !== id),
      );
      return optimisticUpdate<TodoSelect[]>(todosQueryKey, (prev) =>
        prev.filter((todo) => todo.id !== id),
      );
    },
    onSuccess: (id) => {
      toast.success("Todo deleted", {
        id: toastId.current,
        action: { label: "Undo", onClick: () => undoDeleteTodo.mutate({ id }) },
      });
    },
    onError: (error, _, context) => {
      onErrorOptimistic(tagsQueryKey, context);
      onErrorOptimistic(todosQueryKey, context);
      onError(error);
    },
  });

  const deleteCompleted = useMutation({
    mutationFn: actions.deleteCompletedTodos.orThrow,
    onError,
  });

  const createTodo = useMutation({
    mutationFn: actions.createTodo.orThrow,
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

  const createSharedTag = useMutation({
    mutationFn: actions.createSharedTag.orThrow,
    onError,
  });

  return {
    updateTodo,
    deleteTodo,
    deleteCompleted,
    createTodo,
    deleteUser,
    createSharedTag,
  };
}
