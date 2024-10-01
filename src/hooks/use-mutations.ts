import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { actions } from "astro:actions";
import useMutationHelpers from "./use-mutation-helpers";
import { useNavigate } from "react-router-dom";

export default function useMutations() {
  const client = useQueryClient();
  const navigate = useNavigate();

  const { onError, onMutateMessage, toastId } = useMutationHelpers();

  const updateTodo = useMutation({
    mutationFn: actions.updateTodo.orThrow,
    onError,
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
    onSuccess: (id) => {
      toast.success("Todo deleted", {
        id: toastId.current,
        action: { label: "Undo", onClick: () => undoDeleteTodo.mutate({ id }) },
      });
    },
    onError,
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

  const deleteSharedTag = useMutation({
    mutationFn: actions.deleteSharedTag.orThrow,
    onError,
  });

  const approveSharedTag = useMutation({
    mutationFn: actions.approveSharedTag.orThrow,
    onError,
  });

  const updateList = useMutation({
    mutationFn: actions.updateList.orThrow,
    onError,
  });

  const createList = useMutation({
    mutationFn: actions.createList.orThrow,
    onError,
    onSuccess: ({ id }) => {
      navigate(`/list/${id}`);
    },
  });

  return {
    updateTodo,
    deleteTodo,
    deleteCompleted,
    createTodo,
    deleteUser,
    createSharedTag,
    deleteSharedTag,
    approveSharedTag,
    updateList,
    createList,
  };
}
