import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { actions } from "astro:actions";
import { qList, qLists, qTodos, qUser } from "@/app/lib/queries";
import type { TodoSelect } from "@/lib/types";
import { useNavigate, useParams, useRouter } from "@tanstack/react-router";
import { handleError } from "../lib/error";

type Updater<T> = (data: T | undefined) => T;

export default function useMutations() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const navigate = useNavigate();

  const { listId: selectedList = "" } = useParams({ strict: false });

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

  return {
    // TODOS
    createTodo: useMutation({
      mutationFn: actions.todos.create.orThrow,
      onSuccess: (data) => {
        const updater: Updater<TodoSelect[]> = (todos = []) => [data, ...todos];
        modifyTodoCache(data.list.id, updater);
      },
    }),
    updateTodo: useMutation({
      mutationFn: actions.todos.update.orThrow,
      onMutate: async ({ todoId, data }) => {
        const updater: Updater<TodoSelect[]> = (todos = []) =>
          todos.map((todo) =>
            todo.id === todoId ? { ...todo, ...data } : todo,
          );
        const resetter = await modifyTodoCache(selectedList, updater);
        return { resetter };
      },
      onError: (error, _, context) => {
        handleError(error);
        context?.resetter();
      },
    }),
    deleteTodo: useMutation({
      mutationFn: actions.todos.remove.orThrow,
      onMutate: async ({ todoId }) => {
        const updater: Updater<TodoSelect[]> = (todos = []) =>
          todos.filter((todo) => todo.id !== todoId);
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
    }),
    deleteCompletedTodos: useMutation({
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
    }),
    uncheckCompletedTodos: useMutation({
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
    }),
    moveTodo: useMutation({
      mutationFn: actions.todos.update.orThrow,
      onMutate: async ({ todoId }) => {
        const updater: Updater<TodoSelect[]> = (todos = []) =>
          todos.filter((todo) => todo.id !== todoId);
        const resetter = await modifyTodoCache(selectedList, updater);
        return { resetter };
      },
      onError: (error, _, context) => {
        handleError(error);
        context?.resetter();
      },
      onSuccess: (_, { todoId, data: { listId } }) => {
        const lists = queryClient.getQueryData(qLists().queryKey);
        const nextList = lists?.find((list) => list.id === listId);
        if (!nextList) return;

        toast.success(`Todo moved to ${nextList.name}`, {
          action: {
            label: "View",
            onClick: () =>
              navigate({
                to: "/todos/$listId",
                params: { listId: nextList.id },
                search: { highlightedTodoId: todoId },
              }),
          },
        });
      },
    }),

    // USERS
    deleteUser: useMutation({
      mutationFn: actions.users.remove.orThrow,
      onSuccess: () => {
        queryClient.clear();
        window.location.href = "/";
      },
    }),
    updateUserSettings: useMutation({
      mutationFn: actions.users.update.orThrow,
      onSuccess: (data) => {
        queryClient.setQueryData(qUser().queryKey, (prev) => {
          if (!prev) return data;
          return { ...prev, ...data };
        });
        toast.success("Settings updated");
      },
    }),

    // LISTS
    updateList: useMutation({
      mutationFn: actions.lists.update.orThrow,
      onSuccess: (data) => {
        router.invalidate();
        queryClient.setQueryData(qLists().queryKey, (prev) => {
          if (!prev) return prev;
          return prev.map((list) =>
            list.id === data.id ? { ...list, ...data } : list,
          );
        });
        queryClient.setQueryData(qList(data.id).queryKey, data);
      },
    }),
    createList: useMutation({
      mutationFn: actions.lists.create.orThrow,
      onSuccess: ({ id, name }) => {
        router.invalidate();
        toast.success(`${name} created`);
        navigate({ to: "/todos/$listId", params: { listId: id } });
      },
    }),
    deleteList: useMutation({
      mutationFn: actions.lists.remove.orThrow,
      onMutate: ({ listId }) => {
        if (listId === selectedList) navigate({ to: "/" });
      },
      onSuccess: () => {
        router.invalidate();
        toast.success("List deleted");
      },
    }),
    updateListSortShow: useMutation({
      mutationFn: actions.lists.updateSortShow.orThrow,
      onSuccess: (newLists) => {
        router.invalidate();
        queryClient.setQueryData(qLists().queryKey, newLists);
      },
    }),

    // LIST USERS
    inviteToList: useMutation({
      mutationFn: actions.listUsers.inviteToList.orThrow,
      onSuccess: (_, { email }) => {
        toast.success(`Invitation sent to "${email}"`);
      },
    }),
    removeFromList: useMutation({
      mutationFn: actions.listUsers.removeFromList.orThrow,
      onSuccess: () => {
        toast.success("User removed from list");
      },
    }),
    acceptInvite: useMutation({
      mutationFn: actions.listUsers.acceptInvite.orThrow,
      onSuccess: () => {
        toast.success("You have joined the list");
      },
    }),
    leaveList: useMutation({
      mutationFn: actions.listUsers.leaveList.orThrow,
      onSuccess: () => {
        toast.success("You have left the list");
      },
    }),
  };
}
