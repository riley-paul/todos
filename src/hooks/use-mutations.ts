import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { actions } from "astro:actions";
import { useAtom } from "jotai/react";
import { selectedListAtom } from "@/lib/store";

export default function useMutations() {
  const client = useQueryClient();
  const [selectedList, setSelectedList] = useAtom(selectedListAtom);

  const updateTodo = useMutation({
    mutationFn: actions.updateTodo.orThrow,
  });

  const deleteTodo = useMutation({
    mutationFn: actions.deleteTodo.orThrow,
    onSuccess: () => {
      toast.success("Todo deleted");
    },
  });

  const createTodo = useMutation({
    mutationFn: actions.createTodo.orThrow,
  });

  const deleteUser = useMutation({
    mutationFn: actions.deleteUser.orThrow,
    onSuccess: () => {
      client.clear();
      window.location.href = "/";
    },
  });

  const updateList = useMutation({
    mutationFn: actions.updateList.orThrow,
  });

  const createList = useMutation({
    mutationFn: actions.createList.orThrow,
  });

  const deleteList = useMutation({
    mutationFn: actions.deleteList.orThrow,
    onSuccess: (_, { id }) => {
      if (id === selectedList) setSelectedList(undefined);
      toast.success("List deleted");
    },
  });

  const createListShare = useMutation({
    mutationFn: actions.createListShare.orThrow,
  });

  const deleteListShare = useMutation({
    mutationFn: actions.deleteListShare.orThrow,
  });

  const acceptListShare = useMutation({
    mutationFn: actions.acceptListShare.orThrow,
    onSuccess: () => {
      toast.success("You now have access to this list");
    },
  });

  const leaveListShare = useMutation({
    mutationFn: actions.leaveListShare.orThrow,
    onSuccess: () => {
      toast.success("You no longer have access to this list");
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
