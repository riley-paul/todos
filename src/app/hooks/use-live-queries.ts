import { count, eq, useLiveQuery } from "@tanstack/react-db";
import { useSuspenseQuery } from "@tanstack/react-query";
import { qUser } from "../lib/queries";
import {
  listCollection,
  listUserCollection,
  todoCollection,
} from "../lib/collections";
import type { ListQ } from "@/lib/types";

export const useLiveLists = (): ListQ[] => {
  const { data: user } = useSuspenseQuery(qUser);
  const { data: lists } = useLiveQuery((q) => {
    const todoCounts = q
      .from({ todo: todoCollection })
      .groupBy(({ todo }) => todo.listId)
      .select(({ todo }) => ({
        listId: todo.listId,
        count: count(todo.id),
      }));

    return q
      .from({ list: listCollection })
      .innerJoin({ listUser: listUserCollection }, ({ listUser, list }) =>
        eq(listUser.listId, list.id),
      )
      .innerJoin({ todoCount: todoCounts }, ({ todoCount, list }) =>
        eq(todoCount.listId, list.id),
      )
      .where(({ listUser }) => eq(listUser.userId, user.id))
      .select(({ list, listUser, todoCount }) => ({
        id: list.id,
        name: list.name,
        todoCount: todoCount.count,
        isPending: listUser.isPending,
        show: listUser.show,
      }));
  });

  return lists;
};
