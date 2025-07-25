import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ActionInputError, actions, isActionError } from "astro:actions";
import { qLists, qTodos, qUser } from "@/lib/client/queries";
import type { SelectedList, TodoSelect } from "@/lib/types";
import { useNavigate, useParams } from "@tanstack/react-router";
import { goToList } from "@/lib/client/links";

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
    const queryKey = qTodos(listId).queryKey;
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
    onMutate: async ({ listId }) => {
      const updater: TodosUpdater = (todos = []) =>
        todos.filter((todo) => !todo.isCompleted);
      const resetters = await Promise.all([modifyTodoCache(listId, updater)]);
      return { resetters };
    },
    onError: (error, _, context) => {
      handleMutationError(error);
      context?.resetters.forEach((reset) => reset());
    },
    onSuccess: () => {
      toast.success("Completed todos deleted");
    },
  });

  const uncheckCompletedTodos = useMutation({
    mutationFn: actions.todos.uncheckCompleted.orThrow,
    onMutate: async ({ listId }) => {
      const updater: TodosUpdater = (todos = []) =>
        todos.map((todo) => ({ ...todo, isCompleted: false }));
      const resetters = await Promise.all([modifyTodoCache(listId, updater)]);
      return { resetters };
    },
    onError: (error, _, context) => {
      handleMutationError(error);
      context?.resetters.forEach((reset) => reset());
    },
    onSuccess: () => {
      toast.success("All completed todos unchecked");
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
      const lists = queryClient.getQueryData(qLists.queryKey);
      const nextList = lists?.find((list) => list.id === listId);
      toast.success(`Todo moved to ${nextList?.name ?? "Unknown"}`, {
        action: {
          label: "Go to list",
          onClick: () => navigate(goToList(listId)),
        },
      });
    },
  });

  const deleteUser = useMutation({
    mutationFn: actions.users.remove.orThrow,
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/";
    },
  });

  const updateUserSettings = useMutation({
    mutationFn: actions.users.updateUserSettings.orThrow,
    onSuccess: (data) => {
      queryClient.setQueryData(qUser.queryKey, (prev) => {
        if (!prev) return data;
        return { ...prev, ...data };
      });
      toast.success("Settings updated");
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

  const joinList = useMutation({
    mutationFn: actions.listUsers.create.orThrow,
  });

  const acceptListJoin = useMutation({
    mutationFn: actions.listUsers.accept.orThrow,
    onSuccess: (data) => {
      toast.success(`You now have access to "${data.list.name}"`, {
        action: {
          label: "Go to list",
          onClick: () => navigate(goToList(data.list.id)),
        },
      });
    },
  });

  const deleteList = useMutation({
    mutationFn: actions.lists.remove.orThrow,
    onSuccess: () => {
      navigate({ to: "/" });
      toast.success("List deleted");
    },
  });

  const leaveList = useMutation({
    mutationFn: actions.listUsers.remove.orThrow,
    onSuccess: (_, { userId, listId }) => {
      navigate({ to: "/" });
      const lists = queryClient.getQueryData(qLists.queryKey);
      const list = lists?.find((l) => l.id === listId);

      if (userId) {
        toast.success(`User removed from "${list?.name ?? "the list"}"`);
        return;
      }
      toast.success(`You left "${list?.name ?? "the list"}"`);
    },
  });

  return {
    updateTodo,
    deleteTodo,
    deleteCompletedTodos,
    uncheckCompletedTodos,
    createTodo,
    moveTodo,
    deleteUser,
    updateUserSettings,
    updateList,
    createList,
    deleteList,
    leaveList,
    joinList,
    acceptListJoin,
  };
}
