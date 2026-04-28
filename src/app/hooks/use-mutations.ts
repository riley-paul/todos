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
  const navigate = useNavigate();

  const { listId: selectedList = "" } = useParams({ strict: false });

  /* TODOS */

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

  const createTodo = useMutation({
    mutationFn: actions.todos.create.orThrow,
    onSuccess: (data) => {
      const updater: Updater<TodoSelect[]> = (todos = []) => [data, ...todos];
      modifyTodoCache(data.list.id, updater);
    },
  });

  const updateTodo = useMutation({
    mutationFn: actions.todos.update.orThrow,
    onMutate: async ({ id, data }) => {
      const updater: Updater<TodoSelect[]> = (todos = []) =>
        todos.map((todo) => (todo.id === id ? { ...todo, ...data } : todo));
      const resetter = await modifyTodoCache(selectedList, updater);
      return { resetter };
    },
    onError: (error, _, context) => {
      handleError(error);
      context?.resetter();
    },
  });

  const deleteTodo = useMutation({
    mutationFn: actions.todos.remove.orThrow,
    onMutate: async ({ id }) => {
      const updater: Updater<TodoSelect[]> = (todos = []) =>
        todos.filter((todo) => todo.id !== id);
      const resetter = await modifyTodoCache(selectedList, updater);
      return { resetter };
    },
    onError: (error, _, context) => {
      handleError(error);
      context?.resetter();
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
      const resetter = await modifyTodoCache(listId, updater);
      return { resetter };
    },
    onError: (error, _, context) => {
      handleError(error);
      context?.resetter();
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
      const resetter = await modifyTodoCache(listId, updater);
      return { resetter };
    },
    onError: (error, _, context) => {
      handleError(error);
      context?.resetter();
    },
    onSuccess: () => {
      toast.success("All completed todos unchecked");
    },
  });

  const moveTodo = useMutation({
    mutationFn: actions.todos.update.orThrow,
    onMutate: async ({ id }) => {
      const updater: Updater<TodoSelect[]> = (todos = []) =>
        todos.filter((todo) => todo.id !== id);
      const resetter = await modifyTodoCache(selectedList, updater);
      return { resetter };
    },
    onError: (error, _, context) => {
      handleError(error);
      context?.resetter();
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

  /* USERS */

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

  /* LISTS */

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
      toast.success(`${name} created`);
      navigate({ to: "/todos/$listId", params: { listId: id } });
    },
  });

  const inviteUserToList = useMutation({
    mutationFn: actions.listUsers.create.orThrow,
  });

  const deleteList = useMutation({
    mutationFn: actions.lists.remove.orThrow,
    onMutate: ({ id }) => {
      if (id === selectedList) navigate({ to: "/" });
    },
    onSuccess: () => {
      router.invalidate();
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

  const updateListSortShow = useMutation({
    mutationFn: actions.lists.updateSortShow.orThrow,
    onSuccess: (newLists) => {
      router.invalidate();
      queryClient.setQueryData(qLists.queryKey, newLists);
    },
  });

  return {
    createTodo,
    updateTodo,
    deleteTodo,
    deleteCompletedTodos,
    uncheckCompletedTodos,
    moveTodo,

    deleteUser,
    updateUserSettings,

    updateList,
    createList,
    deleteList,

    inviteUserToList,
    removeUserFromList,

    updateListSortShow,
  };
}
