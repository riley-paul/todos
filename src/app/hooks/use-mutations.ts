import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { actions } from "astro:actions";
import { qList, qLists, qTodos, qUser } from "@/app/lib/queries";
import type { TodoSelect } from "@/lib/types";
import { useNavigate, useParams, useRouter } from "@tanstack/react-router";
import { handleError } from "../lib/errors";

type Updater<T> = (data: T | undefined) => T;

export default function useMutations() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { listId } = useParams({ strict: false });
  const selectedList = listId ?? "";

  const navigate = useNavigate();

  const modifyTodoCache = async (
    listId: string,
    updater: Updater<TodoSelect[]>,
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
      const updater: Updater<TodoSelect[]> = (todos = []) =>
        todos.map((todo) => (todo.id === id ? { ...todo, ...data } : todo));

      const resetters = await Promise.all([
        modifyTodoCache(selectedList, updater),
        modifyTodoCache("all", updater),
      ]);

      return { resetters };
    },
    onError: (error, _, context) => {
      handleError(error);
      context?.resetters.forEach((reset) => reset());
    },
  });

  const deleteTodo = useMutation({
    mutationFn: actions.todos.remove.orThrow,
    onMutate: async ({ id }) => {
      const updater: Updater<TodoSelect[]> = (todos = []) =>
        todos.filter((todo) => todo.id !== id);

      const resetters = await Promise.all([
        modifyTodoCache(selectedList, updater),
        modifyTodoCache("all", updater),
      ]);

      return { resetters };
    },
    onError: (error, _, context) => {
      handleError(error);
      context?.resetters.forEach((reset) => reset());
    },
    onSuccess: () => {
      toast.success("Todo deleted");
    },
  });

  const deleteCompletedTodos = useMutation({
    mutationFn: actions.todos.removeCompleted.orThrow,
    onMutate: async ({ listId }) => {
      const updater: Updater<TodoSelect[]> = (todos = []) =>
        todos.filter((todo) => !todo.isCompleted);
      const resetters = await Promise.all([modifyTodoCache(listId, updater)]);
      return { resetters };
    },
    onError: (error, _, context) => {
      handleError(error);
      context?.resetters.forEach((reset) => reset());
    },
    onSuccess: () => {
      toast.success("Completed todos deleted");
    },
  });

  const uncheckCompletedTodos = useMutation({
    mutationFn: actions.todos.uncheckCompleted.orThrow,
    onMutate: async ({ listId }) => {
      const updater: Updater<TodoSelect[]> = (todos = []) =>
        todos.map((todo) => ({ ...todo, isCompleted: false }));
      const resetters = await Promise.all([modifyTodoCache(listId, updater)]);
      return { resetters };
    },
    onError: (error, _, context) => {
      handleError(error);
      context?.resetters.forEach((reset) => reset());
    },
    onSuccess: () => {
      toast.success("All completed todos unchecked");
    },
  });

  const createTodo = useMutation({
    mutationFn: actions.todos.create.orThrow,
    onSuccess: ({ listId }) => {
      navigate({ to: "/todos/$listId", params: { listId } });
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
    onSuccess: (_, { id, data: { listId } }) => {
      const lists = queryClient.getQueryData(qLists.queryKey);
      const nextList = lists?.find((list) => list.id === listId);
      if (!nextList) return;

      toast.success(`Todo moved to ${nextList.name}`, {
        action: {
          label: "View",
          onClick: () =>
            navigate({
              to: "/todos/$listId",
              params: { listId: nextList.id },
              search: { highlightedTodoId: id },
            }),
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
    onSuccess: (data) => {
      router.invalidate();
      queryClient.setQueryData(qLists.queryKey, (prev) => {
        if (!prev) return prev;
        return prev.map((list) =>
          list.id === data.id ? { ...list, ...data } : list,
        );
      });
      queryClient.setQueryData(qList(data.id).queryKey, data);
    },
  });

  const createList = useMutation({
    mutationFn: actions.lists.create.orThrow,
    onSuccess: ({ id }, { name }) => {
      router.invalidate();
      toast.success(`List "${name}" created`);
      navigate({ to: "/todos/$listId", params: { listId: id } });
    },
  });

  const createListJoin = useMutation({
    mutationFn: actions.listUsers.create.orThrow,
  });

  const acceptListJoin = useMutation({
    mutationFn: actions.listUsers.accept.orThrow,
    onSuccess: (data) => {
      toast.success(`You now have access to "${data.list.name}"`, {
        action: {
          label: "Go to list",
          onClick: () =>
            navigate({
              to: "/todos/$listId",
              params: { listId: data.list.id },
            }),
        },
      });
    },
  });

  const deleteList = useMutation({
    mutationFn: actions.lists.remove.orThrow,
    onSuccess: () => {
      router.invalidate();
      navigate({ to: "/" });
      toast.success("List deleted");
    },
  });

  const removeUserFromList = useMutation({
    mutationFn: actions.listUsers.remove.orThrow,
    onSuccess: (_, { listId }) => {
      const lists = queryClient.getQueryData(qLists.queryKey);
      const list = lists?.find((l) => l.id === listId);
      toast.success(`User removed from ${list?.name ?? "the list"}`);
    },
  });

  const removeSelfFromList = useMutation({
    mutationFn: actions.listUsers.remove.orThrow,
    onSuccess: (_, { listId }) => {
      navigate({ to: "/" });
      const lists = queryClient.getQueryData(qLists.queryKey);
      const list = lists?.find((l) => l.id === listId);
      toast.success(`You left "${list?.name ?? "the list"}"`);
    },
  });

  const updateListSortShow = useMutation({
    mutationFn: actions.lists.updateSortShow.orThrow,
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

    createListJoin,
    acceptListJoin,
    removeSelfFromList,
    removeUserFromList,

    updateListSortShow,
  };
}
