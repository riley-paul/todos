import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ActionInputError, actions, isActionError } from "astro:actions";
import { listsQueryOptions, todosQueryOptions } from "@/lib/queries";
import type { SelectedList, TodoSelect } from "@/lib/types";
import { useNavigate, useParams } from "@tanstack/react-router";
import goToList from "@/lib/go-to-list";

type TodosUpdater = (todos: TodoSelect[] | undefined) => TodoSelect[];

export const handleMutationError = (error: Error) => {
  console.error(error);

  let status = 500;
  let description = error.message;

  if (isActionError(error)) {
    status = error.status;
    description = error.message;
  }

  if (error instanceof ActionInputError) {
    status = 400;
    description = error.issues.map((issue) => issue.message).join(", ");
  }

  toast.error(`${status} Error`, { description });
};

export default function useMutations() {
  const queryClient = useQueryClient();

  const { listId } = useParams({ strict: false });
  const selectedList = listId ?? null;

  const navigate = useNavigate();

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
    mutationFn: actions.todos.update.orThrow,
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
    mutationFn: actions.todos.remove.orThrow,
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
    mutationFn: actions.todos.removeCompleted.orThrow,
    onSuccess: () => {
      toast.success("Completed todos deleted");
    },
  });

  const createTodo = useMutation({
    mutationFn: actions.todos.create.orThrow,
    onSuccess: ({ listId }) => {
      navigate(goToList(listId));
    },
  });

  const moveTodo = useMutation({
    mutationFn: actions.todos.update.orThrow,
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
    mutationFn: actions.users.remove.orThrow,
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/";
    },
  });

  const updateList = useMutation({
    mutationFn: actions.lists.update.orThrow,
  });

  const createList = useMutation({
    mutationFn: actions.lists.create.orThrow,
    onSuccess: ({ id }, { name }) => {
      toast.success(`List "${name}" created`);
      navigate(goToList(id));
    },
  });

  const deleteList = useMutation({
    mutationFn: actions.lists.remove.orThrow,
    onSuccess: (_, { id }) => {
      if (id === selectedList) navigate({ to: "/" });
      toast.success("List deleted");
    },
  });

  const createListShare = useMutation({
    mutationFn: actions.listShares.create.orThrow,
  });

  const deleteListShare = useMutation({
    mutationFn: actions.listShares.remove.orThrow,
  });

  const acceptListShare = useMutation({
    mutationFn: actions.listShares.accept.orThrow,
    onSuccess: () => {
      toast.success("You now have access to this list");
    },
  });

  const leaveListShare = useMutation({
    mutationFn: actions.listShares.leave.orThrow,
    onSuccess: () => {
      toast.success("You no longer have access to this list");
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
    leaveListShare,
  };
}
