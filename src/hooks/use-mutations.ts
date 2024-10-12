import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { actions } from "astro:actions";
import useMutationHelpers from "./use-mutation-helpers";
import { useAtom } from "jotai/react";
import { selectedListAtom } from "@/lib/store";

export default function useMutations() {
  const client = useQueryClient();
  const [selectedList, setSelectedList] = useAtom(selectedListAtom);

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

  const updateList = useMutation({
    mutationFn: actions.updateList.orThrow,
    onError,
  });

  const createList = useMutation({
    mutationFn: actions.createList.orThrow,
    onError,
  });

  const deleteList = useMutation({
    mutationFn: actions.deleteList.orThrow,
    onError,
    onSuccess: (_, { id }) => {
      if (id === selectedList) setSelectedList(undefined);
      toast.success("List deleted", { id: toastId.current });
    },
  });

  const createListShare = useMutation({
    mutationFn: actions.createListShare.orThrow,
    onError,
  });

  const deleteListShare = useMutation({
    mutationFn: actions.deleteListShare.orThrow,
    onError,
  });

  const acceptListShare = useMutation({
    mutationFn: actions.acceptListShare.orThrow,
    onError,
    onSuccess: () => {
      toast.success("You now have access to this list", {
        id: toastId.current,
      });
    },
  });

  const leaveListShare = useMutation({
    mutationFn: actions.leaveListShare.orThrow,
    onError,
    onSuccess: () => {
      toast.success("You no longer have access to this list", {
        id: toastId.current,
      });
    },
  });

  return {
    updateTodo,
    deleteTodo,
    createTodo,
    deleteUser,
    updateList,
    createList,
    deleteList,
    createListShare,
    deleteListShare,
    acceptListShare,
    leaveListShare,
  };
}
