import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { actions, isActionError } from "astro:actions";
import { listsQueryOptions, todosQueryOptions } from "@/lib/queries";
import type { SelectedList, TodoSelect } from "@/lib/types";
import useSelectedList from "./use-selected-list";

type TodosUpdater = (todos: TodoSelect[] | undefined) => TodoSelect[];

export const handleMutationError = (error: Error) => {
  console.error(error);

  let status = 500;
  let description = error.message;

  if (isActionError(error)) {
    status = error.status;
    description = error.message;
  }

  toast.error(`${status} Error`, { description });
};

export default function useMutations() {
  const queryClient = useQueryClient();
  const { selectedList, setSelectedList } = useSelectedList();

  const modifyTodoCache = async (
    listId: SelectedList,
    updater: TodosUpdater,
  ) => {
    const queryKey = todosQueryOptions(listId).queryKey;
    await queryClient.cancelQueries({ queryKey });

    const previous = queryClient.getQueryData(queryKey);
    const reset = () => queryClient.setQueryData(queryKey, previous);

    queryClient.setQueryData<TodoSelect[]>(queryKey, updater);
    return reset;
  };

  const updateTodo = useMutation({
    mutationFn: actions.updateTodo.orThrow,
    onMutate: async ({ id, data }) => {
      const updater: TodosUpdater = (todos = []) =>
        todos.map((todo) => (todo.id === id ? { ...todo, ...data } : todo));

      const resetters = await Promise.all([
        modifyTodoCache(selectedList, updater),
        modifyTodoCache("all", updater),
      ]);

      return { resetters };
    },
    onError: (error, _, context) => {
      handleMutationError(error);
      context?.resetters.forEach((reset) => reset());
    },
  });

  const deleteTodo = useMutation({
    mutationFn: actions.deleteTodo.orThrow,
    onMutate: async ({ id }) => {
      const updater: TodosUpdater = (todos = []) =>
        todos.filter((todo) => todo.id !== id);

      const resetters = await Promise.all([
        modifyTodoCache(selectedList, updater),
        modifyTodoCache("all", updater),
      ]);

      return { resetters };
    },
    onError: (error, _, context) => {
      handleMutationError(error);
      context?.resetters.forEach((reset) => reset());
    },
    onSuccess: () => {
      toast.success("Todo deleted");
    },
  });

  const deleteCompletedTodos = useMutation({
    mutationFn: actions.deleteCompletedTodos.orThrow,
    onSuccess: () => {
      toast.success("Completed todos deleted");
    },
  });

  const createTodo = useMutation({
    mutationFn: actions.createTodo.orThrow,
  });

  const moveTodo = useMutation({
    mutationFn: actions.updateTodo.orThrow,
    onMutate: async ({ id }) => {
      const resetters = await Promise.all(
        selectedList === "all"
          ? []
          : [
              modifyTodoCache(selectedList, (todos = []) =>
                todos.filter((todo) => todo.id !== id),
              ),
            ],
      );
      return { resetters };
    },
    onError: (__, _, context) => {
      context?.resetters.forEach((reset) => reset());
    },
    onSuccess: (_, { data: { listId } }) => {
      const lists = queryClient.getQueryData(listsQueryOptions.queryKey);
      const nextList = lists?.find((list) => list.id === listId);
      toast.success(`Todo moved to ${nextList?.name ?? "Unknown"}`);
    },
  });

  const deleteUser = useMutation({
    mutationFn: actions.deleteUser.orThrow,
    onSuccess: () => {
      queryClient.clear();
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
      if (id === selectedList) setSelectedList(null);
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

  return {
    updateTodo,
    deleteTodo,
    deleteCompletedTodos,
    createTodo,
    moveTodo,
    deleteUser,
    updateList,
    createList,
    deleteList,
    createListShare,
    deleteListShare,
    acceptListShare,
  };
}
